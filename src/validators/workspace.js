import { z } from 'zod'

export const WorkspaceSchema = z.object({
  type: z.string().min(1),
  name: z.string().min(3),
  description: z.string().optional()
})

export const joinWorkspaceSchema = z.object({
  joinCode: z.string().min(1)
})

export const addWorkspaceMemberSchema = z.object({
  memberId: z.string().min(1),
  role: z.enum(['admin', 'member']).optional()
})

export const updateWorkspaceMemberSchema = z.object({
  role: z.enum(['admin', 'member'])
})

export const addWorkspaceChannelSchema = z.object({
  name: z.string().trim().min(1)
})
