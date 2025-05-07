import { createSolanaClient, KeyPairSigner, SolanaClient } from 'gill'
import { loadKeypairSignerFromFile } from 'gill/node'
import { ApiConfig, getApiConfig } from './get-api-config.js'
import { ApiLogger, log } from './api-logger.js'
import { initializeVerxio, VerxioContext } from '@verxioprotocol/core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { publicKey } from '@metaplex-foundation/umi'

export interface ApiContext {
  client: SolanaClient
  log: ApiLogger
  signer: KeyPairSigner
  verxio: VerxioContext
}

let context: ApiContext | undefined

export async function getApiContext(): Promise<ApiContext> {
  if (context) {
    return context
  }

  const config: ApiConfig = getApiConfig()

  const umi = createUmi(config.solanaRpcEndpoint)
  const client = createSolanaClient({ urlOrMoniker: config.solanaRpcEndpoint })
  const signer = await loadKeypairSignerFromFile(config.solanaSignerPath)
  const verxio = initializeVerxio(umi, publicKey(signer.address))

  context = { client, log, signer, verxio }

  return context
}
