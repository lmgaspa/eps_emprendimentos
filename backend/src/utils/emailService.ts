import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

export async function sendTicketEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  await transporter.sendMail({
    from: `"Suporte ERP" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  })
}

//