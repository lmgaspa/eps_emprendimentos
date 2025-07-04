import { Router } from 'express'
import { login, register } from '../controllers/auth.controller'
import { verifyToken } from '../middlewares/auth.middleware'
import { isAdmin } from '../middlewares/isAdmin'
import { getProfile } from '../controllers/profile.controller'
import {
  forgotPassword,
  resetPassword
} from '../controllers/password.controller'

const router = Router()

// Rotas públicas
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

// Rotas protegidas
router.post('/register', verifyToken, isAdmin, register)
router.get('/profile', verifyToken, getProfile)

export default router
