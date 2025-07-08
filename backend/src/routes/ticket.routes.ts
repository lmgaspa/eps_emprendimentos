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
  getTicketsByEmail,
  getTicketsByEmpresa
} from '../controllers/ticketSearchController'
import { verifyToken } from '../middlewares/auth.middleware';
import Ticket from '../models/Ticket'

const router = Router();

// Criação de ticket (qualquer funcionário)
router.post('/', verifyToken, createTicket);

router.get('/tickets/cpf/:cpf', getTicketsByCpf);
router.get('/tickets/cnpj/:cnpj', getTicketsByCnpj);
router.get('/tickets/email/:email', getTicketsByEmail);
router.get('/tickets/telefone/:telefone', getTicketsByTelefone);
router.get('/tickets/whatsapp/:whatsapp', getTicketsByWhatsapp);
router.get('/tickets/empresa/:empresa', getTicketsByEmpresa);

// Buscar todos (protegido)
router.get('/all', verifyToken, getAllTickets);

router.get('/cpf/:cpf', getTicketsByCpf);
router.get('/cnpj/:cnpj', getTicketsByCnpj);
router.get('/email/:email', getTicketsByEmail);
router.get('/telefone/:telefone', getTicketsByTelefone);
router.get('/whatsapp/:whatsapp', getTicketsByWhatsapp);
router.get('/empresa/:empresa', getTicketsByEmpresa);
router.get('/tickets/nota/:id', getTicketByNota)
router.get('/cliente/:cliente', getTicketsByCliente);

const camposPermitidos = ['cliente', 'id', 'cpf', 'cnpj', 'whatsapp', 'telefone', 'emailEmpresa', 'notaServico']

camposPermitidos.forEach((campo) => {
  router.put(`/${campo}/:valor`, async (req, res) => {
    try {
      const filtro = campo === 'id' ? { _id: req.params.valor } : { [campo]: req.params.valor }
      const ticket = await Ticket.findOneAndUpdate(filtro, { $set: req.body }, { new: true })
      if (!ticket) return res.status(404).json({ erro: 'Ticket não encontrado' })
      res.json(ticket)
    } catch (err) {
      res.status(500).json({ erro: `Erro ao atualizar ticket por ${campo}` })
    }
  })

  router.patch(`/${campo}/:valor`, async (req, res) => {
    try {
      const filtro = campo === 'id' ? { _id: req.params.valor } : { [campo]: req.params.valor }
      const ticket = await Ticket.findOneAndUpdate(filtro, { $set: req.body }, { new: true })
      if (!ticket) return res.status(404).json({ erro: 'Ticket não encontrado' })
      res.json(ticket)
    } catch (err) {
      res.status(500).json({ erro: `Erro ao atualizar parcialmente por ${campo}` })
    }
  })
})

export default router;
