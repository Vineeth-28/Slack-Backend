import { randomUUID } from 'node:crypto'

import { bulkEmailQueue } from '../queues/bulkEmailQueue.js'

export const enqueueBulkEmails = async ({
  recipients,
  subject,
  text,
  html
}) => {
  const batchId = randomUUID()

  await bulkEmailQueue.addBulk(
    recipients.map((to, index) => ({
      name: 'send-email',
      data: { batchId, to, subject, text, html },
      opts: { jobId: `${batchId}-${index}` }
    }))
  )

  return { batchId, queued: recipients.length }
}
