import { getVerxioPass } from './get-verxio-data.js'
import { ApiContext } from './get-api-context.js'
import { publicKey } from '@metaplex-foundation/umi'
import { getApiConfig } from './get-api-config.js'

export interface MemberPass {
  publicKey: string
  name: string
  xp: number
  actionHistory: Array<{
    action: string
    points: number
    timestamp: string
  }>
  currentTier: string
}

export interface Member {
  address: string
  passes: MemberPass[]
  totalXp: number
}

interface NFTAsset {
  id: string
  ownership: {
    owner: string
  }
}

export async function getMembers(context: ApiContext, collectionAddress: string): Promise<Member[]> {
  try {
    if (!collectionAddress) {
      throw new Error('Collection address is required')
    }

    const config = getApiConfig()
    let allNFTs: NFTAsset[] = []
    let page = 1
    let hasMore = true

    // Fetch all NFTs from the collection
    while (hasMore) {
      const response = await fetch(config.solanaRpcEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getAssetsByGroup',
          params: {
            groupKey: 'collection',
            groupValue: collectionAddress,
            page: page,
            limit: 1000
          }
        })
      })

      const data = await response.json()
      
      if (!data.result?.items?.length) {
        hasMore = false
      } else {
        allNFTs = [...allNFTs, ...data.result.items]
        page++
      }

      // Add delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Group NFTs by owner
    const nftsByOwner = allNFTs.reduce((acc, nft) => {
      const owner = nft.ownership.owner
      if (!acc[owner]) {
        acc[owner] = []
      }
      acc[owner].push(nft)
      return acc
    }, {} as Record<string, NFTAsset[]>)

    // Get detailed pass information for each member
    const members: Member[] = await Promise.all(
      Object.entries(nftsByOwner).map(async ([address, memberNFTs]) => {
        const passesWithDetails = await Promise.all(
          memberNFTs.map(async (nft) => {
            try {
              const passData = await getVerxioPass(context.verxio, publicKey(nft.id))
              if (!passData) return null

              return {
                publicKey: nft.id,
                name: passData.name,
                xp: passData.xp,
                actionHistory: passData.actionHistory.map(action => ({
                  action: action.type,
                  points: action.points,
                  timestamp: action.timestamp.toString()
                })),
                currentTier: passData.currentTier
              }
            } catch (error) {
              context.log.error(`Error fetching details for pass ${nft.id}:`, error)
              return null
            }
          })
        )

        const validPasses = passesWithDetails.filter((pass): pass is NonNullable<typeof pass> => pass !== null)
        const totalXp = validPasses.reduce((sum, pass) => sum + pass.xp, 0)

        return {
          address,
          passes: validPasses,
          totalXp
        }
      })
    )

    // Sort members by total XP
    return members.sort((a, b) => b.totalXp - a.totalXp)
  } catch (error) {
    context.log.error('Error fetching members:', error)
    throw new Error('Failed to fetch members')
  }
} 