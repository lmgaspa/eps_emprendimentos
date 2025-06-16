import { Router } from 'express';
import {
  createTicket,
  getTicketById,
  getTicketsByCliente,
  getTicketByNota,
  getAllTickets
} from '../controllers/ticket.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/isAdmin';

const router = Router();

// Criação de ticket (qualquer funcionário)
router.post('/', verifyToken, createTicket);

// Buscar tickets por nome do cliente
router.get('/cliente/:cliente', verifyToken, getTicketsByCliente);

// Buscar ticket por número da nota de serviço
router.get('/nota/:notaServico', verifyToken, getTicketByNota);

// Buscar todos os tickets (somente admin)
router.get('/all', verifyToken, isAdmin, getAllTickets);

// Buscar ticket por ID (deixe por último)
router.get('/:id', verifyToken, getTicketById);

export default router;
