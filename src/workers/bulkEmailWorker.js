import { fileURLToPath } from 'node:url'

import { Worker } from 'bullmq'

import { sendEmail } from '../config/nodemailerConfig.js'
import {
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_USERNAME
} from '../config/serverConfig.js'
import { BULK_EMAIL_QUEUE } from '../queues/bulkEmailQueueName.js'

export const createBulkEmailWorker = async () => {
  const worker = new Worker(
    BULK_EMAIL_QUEUE,
    async (job) => sendEmail(job.data),
    {
      connection: {
        host: REDIS_HOST,
        port: REDIS_PORT,
        username: REDIS_USERNAME || undefined,
        password: REDIS_PASSWORD || undefined,
        maxRetriesPerRequest: null
      },
      concurrency: 10,
      limiter: {
        max: 100,
        duration: 60_000
      }
    }
  )

  worker.on('failed', (job, error) => {
    console.error(`Bulk email job ${job?.id ?? 'unknown'} failed:`, error)
  })
  worker.on('error', (error) => {
    console.error('Bulk email worker error:', error)
  })

  await worker.waitUntilReady()
  console.log('Bulk email worker is ready')

  return worker
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const worker = await createBulkEmailWorker()
  const shutdown = async () => {
    await worker.close()
    process.exitCode = 0
  }

  process.once('SIGINT', shutdown)
  process.once('SIGTERM', shutdown)
}
