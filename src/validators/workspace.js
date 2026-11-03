import { z } from 'zod'

export const WorkspaceSchema = z.object({
  type: z.string().min(1),
  name: z.string().min(3),
  description: z.string().optional()
})
