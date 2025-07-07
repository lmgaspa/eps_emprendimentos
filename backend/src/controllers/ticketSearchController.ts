import { Request, Response, NextFunction } from 'express'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Ticket from '../models/Ticket'

const formatResult = (ticket: any) => ({
  ...ticket.toObject(),
  createdAt: format(ticket.createdAt ?? new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR }),
})

export const getTicketsByCpf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cpf } = req.params
    const tickets = await Ticket.find({ cpf })
    if (!tickets.length) return res.status(404).json({ message: 'CPF não encontrado no registro.' })
    res.json(tickets.map(formatResult))
  } catch (err) {
    next(err)
  }
}

export const getTicketsByCnpj = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cnpj } = req.params
    const tickets = await Ticket.find({ cnpj })
    if (!tickets.length) return res.status(404).json({ message: 'CNPJ não encontrado no registro.' })
    res.json(tickets.map(formatResult))
  } catch (err) {
    next(err)
  }
}

export const getTicketsByWhatsapp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { whatsapp } = req.params
    const tickets = await Ticket.find({ whatsapp })
    if (!tickets.length) return res.status(404).json({ message: 'WhatsApp não encontrado no registro.' })
    res.json(tickets.map(formatResult))
  } catch (err) {
    next(err)
  }
}

export const getTicketsByTelefone = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { telefone } = req.params
    const tickets = await Ticket.find({ telefone })
    if (!tickets.length) return res.status(404).json({ message: 'Telefone não encontrado no registro.' })
    res.json(tickets.map(formatResult))
  } catch (err) {
    next(err)
  }
}
