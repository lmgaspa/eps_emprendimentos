// src/routes/ticket.routes.ts
import { Router } from 'express';
import {
  createTicket,
  getTicketById,
  getTicketsByCliente,
  getTicketByNota
} from '../controllers/ticket.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

// Criação de ticket (protegida por token)
router.post('/', verifyToken, createTicket);

// Buscar ticket por ID
router.get('/:id', verifyToken, getTicketById);

// Buscar tickets por nome do cliente (parcial ou completo)
router.get('/cliente/:cliente', verifyToken, getTicketsByCliente);

// Buscar ticket por número da nota de serviço
router.get('/nota/:notaServico', verifyToken, getTicketByNota);

export default router;
