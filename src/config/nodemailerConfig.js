import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import Handlebars from 'handlebars'
import nodemailer from 'nodemailer'

import {
  FRONTEND_URL,
  SMTP_FROM,
  SMTP_HOST,
  SMTP_PASS,
  SMTP_PORT,
  SMTP_USER,
  TEST_EMAIL
} from './serverConfig.js'

const templatePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'templates',
  'welcome.html'
)

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
})

export const sendStartupEmail = async () => {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !TEST_EMAIL) {
    throw new Error(
      'Email startup test is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS, and TEST_EMAIL.'
    )
  }

  const templateSource = await fs.readFile(templatePath, 'utf8')
  const renderTemplate = Handlebars.compile(templateSource)
  const html = renderTemplate({
    workspaceName: 'Slack Backend',
    name: 'Vineet',
    actionUrl: FRONTEND_URL,
    email: TEST_EMAIL
  })

  return transporter.sendMail({
    from: SMTP_FROM,
    to: TEST_EMAIL,
    subject: 'Slack Backend startup email test',
    html
  })
}
