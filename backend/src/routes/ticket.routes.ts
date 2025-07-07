import { Router } from 'express';
import {
  createTicket,
  getTicketById,
  getTicketsByCliente,
  getTicketByNota,
  getAllTickets
} from '../controllers/ticket.controller';
import {
  getTicketsByCpf,
  getTicketsByCnpj,
  getTicketsByWhatsapp,
  getTicketsByTelefone,
} from '../controllers/ticketSearchController'
import { verifyToken } from '../middlewares/auth.middleware';
import { isAdmin } from '../middlewares/isAdmin';

const router = Router();

// Criação de ticket (qualquer funcionário)
router.post('/', verifyToken, createTicket);

router.get('/tickets/cpf/:cpf', getTicketsByCpf)
router.get('/tickets/cnpj/:cnpj', getTicketsByCnpj)
router.get('/tickets/whatsapp/:whatsapp', getTicketsByWhatsapp)
router.get('/tickets/telefone/:telefone', getTicketsByTelefone)
// Buscar tickets por nome do cliente
router.get('/cliente/:cliente', verifyToken, getTicketsByCliente);

// Buscar ticket por número da nota de serviço
router.get('/nota/:notaServico', verifyToken, getTicketByNota);

// Buscar todos os tickets (somente admin)
router.get('/all', verifyToken, isAdmin, getAllTickets);

// Buscar ticket por ID (deixe por último)
router.get('/:id', verifyToken, getTicketById);

export default router;
