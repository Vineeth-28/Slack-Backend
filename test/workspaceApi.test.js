import assert from 'node:assert/strict'
import { once } from 'node:events'
import test, { after, before } from 'node:test'

import express from 'express'
import jwt from 'jsonwebtoken'

import { JWT_SECRET } from '../src/config/serverConfig.js'
import userRepository from '../src/repositories/userRepository.js'
import apiRouter from '../src/routes/apiRoutes.js'

const app = express()
app.use(express.json())
app.use('/api', apiRouter)

const userId = '507f1f77bcf86cd799439011'
const accessToken = jwt.sign({ user: userId }, JWT_SECRET)
const getById = userRepository.getById
let server
let baseUrl

before(async () => {
  userRepository.getById = async (id) => ({ id })
  server = app.listen(0)
  await once(server, 'listening')
  baseUrl = `http://127.0.0.1:${server.address().port}`
})

after(async () => {
  userRepository.getById = getById
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()))
  })
})

test('workspace endpoints are mounted and require authentication', async () => {
  const requests = [
    ['POST', '/api/v1/workspaces', { type: 'team', name: 'engineering' }],
    ['GET', '/api/v1/workspaces'],
    ['GET', '/api/v1/workspaces/507f1f77bcf86cd799439011'],
    ['POST', '/api/v1/workspaces/join', { joinCode: 'ABC123' }],
    [
      'POST',
      '/api/v1/workspaces/507f1f77bcf86cd799439011/members',
      { memberId: '507f1f77bcf86cd799439012' }
    ],
    [
      'PATCH',
      '/api/v1/workspaces/507f1f77bcf86cd799439011/members/507f1f77bcf86cd799439012',
      { role: 'member' }
    ],
    [
      'POST',
      '/api/v1/workspaces/507f1f77bcf86cd799439011/channels',
      { name: 'engineering' }
    ],
    ['DELETE', '/api/v1/workspaces/507f1f77bcf86cd799439011']
  ]

  for (const [method, path, body] of requests) {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: body ? { 'content-type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined
    })

    assert.equal(response.status, 403, `${method} ${path}`)
    assert.equal((await response.json()).success, false)
  }
})

test('workspace mutation routes validate request bodies before database access', async () => {
  const requests = [
    ['POST', '/api/v1/workspaces', {}],
    ['POST', '/api/v1/workspaces/join', {}],
    ['POST', `/api/v1/workspaces/${userId}/members`, {}],
    [
      'PATCH',
      `/api/v1/workspaces/${userId}/members/${userId}`,
      { role: 'owner' }
    ],
    ['POST', `/api/v1/workspaces/${userId}/channels`, { name: '   ' }]
  ]

  for (const [method, path, body] of requests) {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        'content-type': 'application/json',
        'x-access-token': accessToken
      },
      body: JSON.stringify(body)
    })

    assert.equal(response.status, 400, `${method} ${path}`)
    const result = await response.json()
    assert.equal(result.success, false)
    assert.equal(result.message, 'Validation error')
  }
})

test('signup rejects invalid payloads through the API', async () => {
  const response = await fetch(`${baseUrl}/api/v1/users/signup`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'not-an-email' })
  })

  assert.equal(response.status, 400)
  const result = await response.json()
  assert.equal(result.success, false)
  assert.equal(result.message, 'Validation error')
})
