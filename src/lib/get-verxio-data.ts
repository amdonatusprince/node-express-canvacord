import { PublicKey } from '@metaplex-foundation/umi'
import { getAssetData, getProgramDetails, VerxioContext } from '@verxioprotocol/core'

export async function getVerxioPass(context: VerxioContext, publicKey: PublicKey) {
  const assetData = await getAssetData(context, publicKey)
  return assetData
}

export async function getVerxioProgram(context: VerxioContext, programAddress: PublicKey) {
  // Set collection address for the context
  context.collectionAddress = programAddress
  const programDetails = await getProgramDetails(context)
  return programDetails
} 