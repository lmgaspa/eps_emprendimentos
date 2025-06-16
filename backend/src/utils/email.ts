import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export async function sendTicketEmail(to: string, assunto: string, mensagem: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // <-- Corrigido aqui
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Suporte ERP" <${process.env.EMAIL_USER}>`, // <-- Corrigido aqui também
    to,
    subject: assunto,
    html: `<p>${mensagem}</p>`,
  });
}

//