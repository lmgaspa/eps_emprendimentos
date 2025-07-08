import { Request, Response, NextFunction } from 'express';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Ticket from '../models/Ticket';

const formatResult = (ticket: any) => ({
  ...ticket.toObject(),
  createdAt: format(ticket.createdAt ?? new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
});

export const getTicketsByCliente = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cliente = req.params.cliente?.trim();
    const tickets = await Ticket.find({ cliente: new RegExp(`^${cliente}$`, 'i') });
    if (!tickets.length)
      return res.status(404).json({ message: 'Cliente não encontrado no registro.' });
    res.json(tickets.map(formatResult));
  } catch (err) {
    next(err);
  }
};

export const getTicketsByCpf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cpf = req.params.cpf?.trim();
    const tickets = await Ticket.find({ cpf: new RegExp(`^${cpf}$`, 'i') });
    if (!tickets.length)
      return res.status(404).json({ message: 'CPF não encontrado no registro.' });
    res.json(tickets.map(formatResult));
  } catch (err) {
    next(err);
  }
};

export const getTicketsByCnpj = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cnpj = req.params.cnpj?.trim();
    const tickets = await Ticket.find({ cnpj: new RegExp(`^${cnpj}$`, 'i') });
    if (!tickets.length)
      return res.status(404).json({ message: 'CNPJ não encontrado no registro.' });
    res.json(tickets.map(formatResult));
  } catch (err) {
    next(err);
  }
};

export const getTicketsByWhatsapp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const whatsapp = req.params.whatsapp?.trim();
    const tickets = await Ticket.find({ whatsapp: new RegExp(`^${whatsapp}$`, 'i') });
    if (!tickets.length)
      return res.status(404).json({ message: 'WhatsApp não encontrado no registro.' });
    res.json(tickets.map(formatResult));
  } catch (err) {
    next(err);
  }
};

export const getTicketsByTelefone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const telefone = req.params.telefone?.trim();
    const tickets = await Ticket.find({ telefone: new RegExp(`^${telefone}$`, 'i') });
    if (!tickets.length)
      return res.status(404).json({ message: 'Telefone não encontrado no registro.' });
    res.json(tickets.map(formatResult));
  } catch (err) {
    next(err);
  }
};

export const getTicketsByEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.params.email?.trim();
    const tickets = await Ticket.find({ emailEmpresa: new RegExp(`^${email}$`, 'i') });
    if (!tickets.length)
      return res.status(404).json({ message: 'E-mail não encontrado no registro.' });
    res.json(tickets.map(formatResult));
  } catch (err) {
    next(err);
  }
};

export const getTicketsByEmpresa = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const empresa = req.params.empresa?.trim();
    const tickets = await Ticket.find({ empresa: new RegExp(`${empresa}`, 'i') }).sort({ createdAt: -1 });
    if (!tickets.length)
      return res.status(404).json({ message: 'Empresa não encontrada no registro.' });
    res.json(tickets.map(formatResult));
  } catch (err) {
    next(err);
  }
};

export const getTicketByNota = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notaServico = req.params.notaServico?.trim();
    const ticket = await Ticket.findOne({ notaServico: new RegExp(`^${notaServico}$`, 'i') });
    if (!ticket)
      return res.status(404).json({ message: 'Nota de serviço não encontrada.' });
    res.json(formatResult(ticket));
  } catch (err) {
    next(err);
  }
};

export const getAllTickets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets.map(formatResult));
  } catch (err) {
    next(err);
  }
};
