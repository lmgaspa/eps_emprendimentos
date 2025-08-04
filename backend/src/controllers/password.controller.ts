import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User'
import nodemailer from 'nodemailer'

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body

  const user = await User.findOne({ email })
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' })

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' })

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
  const resetLink = `${frontendUrl}/resetar-senha?token=${token}`

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS
    }
  })

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Redefinição de senha',
    html: `<p>EPS EMPRENDIMENTOS - Clique no link para redefinir sua senha:</p><a href="${resetLink}">${resetLink}</a>`
  })

  return res.json({ message: 'Link de redefinição enviado para o e-mail.' })
}

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }

    const hashed = await bcrypt.hash(newPassword, 10)
    await User.findByIdAndUpdate(decoded.id, { password: hashed })

    return res.json({ message: 'Senha redefinida com sucesso!' })
  } catch (err) {
    return res.status(400).json({ message: 'Token inválido ou expirado.' })
  }
}
