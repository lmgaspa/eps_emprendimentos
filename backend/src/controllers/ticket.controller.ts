import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Ticket from '../models/Ticket';
import { sendTicketEmail } from '../utils/email';

export const createTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      cliente, empresa, cpf, cnpj, emailEmpresa, telefone, whatsapp, descricaoServico,
    } = req.body;

    const notaServico = `NS-${Date.now()}`;
    const createdAt = new Date();

    const newTicket = new Ticket({
      cliente,
      empresa,
      cpf,
      cnpj,
      emailEmpresa,
      telefone,
      whatsapp,
      descricaoServico,
      notaServico,
      createdAt
    });

    const saved = await newTicket.save();

    const formattedDate = format(saved.createdAt ?? new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR });

    if (emailEmpresa) {
      const assunto = `Confirmação do Ticket - ${notaServico}`;
      const mensagem = `
        <p>Olá ${cliente},</p>
        <p>Seu ticket foi registrado com sucesso com os seguintes detalhes:</p>
        <ul>
          <li><strong>Empresa:</strong> ${empresa}</li>
          <li><strong>Serviço:</strong> ${descricaoServico}</li>
          <li><strong>Nota de Serviço:</strong> ${notaServico}</li>
          <li><strong>Data:</strong> ${formattedDate}</li>
        </ul>
        <p>Responderemos em breve!</p>
      `;
      await sendTicketEmail(emailEmpresa, assunto, mensagem);
    }

    const adminMensagem = `
      <p>Um novo ticket foi criado com os seguintes dados:</p>
      <ul>
        <li><strong>Cliente:</strong> ${cliente}</li>
        <li><strong>Empresa:</strong> ${empresa}</li>
        <li><strong>CPF:</strong> ${cpf || 'N/A'}</li>
        <li><strong>CNPJ:</strong> ${cnpj || 'N/A'}</li>
        <li><strong>Telefone:</strong> ${telefone || 'N/A'}</li>
        <li><strong>WhatsApp:</strong> ${whatsapp || 'N/A'}</li>
        <li><strong>Email:</strong> ${emailEmpresa || 'N/A'}</li>
        <li><strong>Serviço:</strong> ${descricaoServico}</li>
        <li><strong>Nota de Serviço:</strong> ${notaServico}</li>
        <li><strong>Data:</strong> ${formattedDate}</li>
      </ul>
    `;
    await sendTicketEmail('luhmgasparetto@gmail.com', `Novo ticket criado - ${notaServico}`, adminMensagem);

    res.status(201).json({ ...saved.toObject(), createdAt: formattedDate });
  } catch (err) {
    next(err);
  }
};

export const getTicketById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      res.status(404).json({ message: 'Ticket não encontrado' });
      return;
    }

    const formattedDate = format(ticket.createdAt ?? new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR });
    res.json({ ...ticket.toObject(), createdAt: formattedDate });
  } catch (err) {
    next(err);
  }
};

export const getTicketsByCliente = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { cliente } = req.params;
    const tickets = await Ticket.find({ cliente: { $regex: cliente, $options: 'i' } }).sort({ createdAt: -1 });

    const formatted = tickets.map(ticket => ({
      ...ticket.toObject(),
      createdAt: format(ticket.createdAt ?? new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR }),
    }));

    res.json(formatted);
  } catch (err) {
    next(err);
  }
};

export const getTicketByNota = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { notaServico } = req.params;
    const ticket = await Ticket.findOne({ notaServico });

    if (!ticket) {
      res.status(404).json({ message: 'Ticket não encontrado pela nota de serviço' });
      return;
    }

    const formattedDate = format(ticket.createdAt ?? new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR });
    res.json({ ...ticket.toObject(), createdAt: formattedDate });
  } catch (err) {
    next(err);
  }
};

export const getAllTickets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });

    const formatted = tickets.map(ticket => ({
      ...ticket.toObject(),
      createdAt: format(ticket.createdAt ?? new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR }),
    }));

    res.json(formatted);
  } catch (err) {
    next(err);
  }
};
