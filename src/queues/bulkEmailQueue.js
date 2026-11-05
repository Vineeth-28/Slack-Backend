import { Queue } from 'bullmq'

import {
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_USERNAME
} from '../config/serverConfig.js'
import { BULK_EMAIL_QUEUE } from './bulkEmailQueueName.js'

export const bulkEmailQueue = new Queue(BULK_EMAIL_QUEUE, {
  connection: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    username: REDIS_USERNAME || undefined,
    password: REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null
  },
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 1000
    },
    removeOnComplete: 1000,
    removeOnFail: 1000
  }
})
