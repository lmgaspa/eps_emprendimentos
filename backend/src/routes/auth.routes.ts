import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/isAdmin';
import { getProfile } from '../controllers/profile.controller';

const router = Router();

router.post('/login', login);
router.post('/register', verifyToken, isAdmin, register);
router.get('/profile', verifyToken, getProfile)

export default router;
