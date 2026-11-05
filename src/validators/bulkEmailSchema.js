import { z } from 'zod'

export const bulkEmailSchema = z
  .object({
    recipients: z
      .array(z.string().email())
      .min(1)
      .max(100, 'A batch cannot contain more than 100 recipients')
      .refine(
        (recipients) =>
          new Set(recipients.map((recipient) => recipient.toLowerCase()))
            .size === recipients.length,
        'Recipients must be unique'
      ),
    subject: z
      .string()
      .trim()
      .min(1)
      .max(200)
      .refine(
        (subject) => !/[\r\n]/.test(subject),
        'Subject cannot contain newlines'
      ),
    text: z.string().max(20000).optional(),
    html: z.string().max(20000).optional()
  })
  .strict()
  .refine((message) => message.text || message.html, {
    message: 'Provide either text or html content'
  })
