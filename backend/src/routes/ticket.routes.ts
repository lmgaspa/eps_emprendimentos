import { Router } from 'express';
import {
  createTicket
} from '../controllers/ticket.controller';
import {
  getTicketsByCpf,
  getTicketsByCnpj,
  getTicketsByWhatsapp,
  getTicketsByTelefone,
  getTicketsByEmail,
  getTicketsByEmpresa,
  getTicketsByCliente,
  getTicketByNota,
  getAllTickets
} from '../controllers/ticket.search.controller';
import { patchTicketByNotaServico, putTicketByNotaServico } from '../controllers/ticket.update.controller'
import { verifyToken } from '../middlewares/auth.middleware';
import Ticket from '../models/Ticket';

const router = Router();

// Criação de ticket (protegida)
router.post('/', verifyToken, createTicket);

// Leitura de tickets (protegidas)
router.get('/all', verifyToken, getAllTickets);
router.get('/cpf/:cpf', verifyToken, getTicketsByCpf);
router.get('/cnpj/:cnpj', verifyToken, getTicketsByCnpj);
router.get('/email/:email', verifyToken, getTicketsByEmail);
router.get('/telefone/:telefone', verifyToken, getTicketsByTelefone);
router.get('/whatsapp/:whatsapp', verifyToken, getTicketsByWhatsapp);
router.get('/empresa/:empresa', verifyToken, getTicketsByEmpresa);
router.get('/cliente/:cliente', verifyToken, getTicketsByCliente);
router.get('/nota/:notaServico', verifyToken, getTicketByNota);
router.patch('/nota/:notaServico', verifyToken, patchTicketByNotaServico);
router.put('/nota/:notaServico', verifyToken, putTicketByNotaServico)

// Atualização de tickets por qualquer campo permitido (protegida)
const camposPermitidos = ['cliente', 'id', 'cpf', 'cnpj', 'whatsapp', 'telefone', 'emailEmpresa', 'notaServico'];

camposPermitidos.forEach((campo) => {
  const basePath = `/${campo}/:valor`;

  router.put(basePath, verifyToken, async (req, res) => {
    try {
      const filtro = campo === 'id' ? { _id: req.params.valor } : { [campo]: req.params.valor };
      const ticket = await Ticket.findOneAndUpdate(filtro, { $set: req.body }, { new: true });
      if (!ticket) return res.status(404).json({ erro: 'Ticket não encontrado' });
      res.json(ticket);
    } catch (err) {
      res.status(500).json({ erro: `Erro ao atualizar ticket por ${campo}` });
    }
  });

  router.patch(basePath, verifyToken, async (req, res) => {
    try {
      const filtro = campo === 'id' ? { _id: req.params.valor } : { [campo]: req.params.valor };
      const ticket = await Ticket.findOneAndUpdate(filtro, { $set: req.body }, { new: true });
      if (!ticket) return res.status(404).json({ erro: 'Ticket não encontrado' });
      res.json(ticket);
    } catch (err) {
      res.status(500).json({ erro: `Erro ao atualizar parcialmente por ${campo}` });
    }
  });
});


export default router;
