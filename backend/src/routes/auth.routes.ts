import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/isAdmin';

const router = Router();

router.post('/login', login);
router.post('/register', verifyToken, isAdmin, register); // protegido por token e role

export default router;
