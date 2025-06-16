import { Request, Response, NextFunction } from 'express';
import { pool } from '../config/db';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { sendTicketEmail } from '../utils/email';

export const createTicket = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      cliente,
      empresa,
      cpf,
      cnpj, 
      emailEmpresa,
      telefone,
      whatsapp,
      descricaoServico,
    } = req.body;

    const id = uuidv4();
    const notaServico = `NS-${Date.now()}`;
    const createdAt = new Date();

    const result = await pool.query(
      `INSERT INTO tickets(id, cliente, empresa, cpf, cnpj, emailEmpresa, telefone, whatsapp, descricaoServico, notaServico, createdAt)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [id, cliente, empresa, cpf, cnpj, emailEmpresa, telefone, whatsapp, descricaoServico, notaServico, createdAt]
    );

    const ticket = result.rows[0];

    if (ticket.createdAt) {
      ticket.createdAt = format(new Date(ticket.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR });
    }

    if (ticket.emailEmpresa) {
      const assunto = `Confirmação do Ticket - ${ticket.notaServico}`;
      const mensagem = `
        <p>Olá ${ticket.cliente},</p>
        <p>Seu ticket foi registrado com sucesso com os seguintes detalhes:</p>
        <ul>
          <li><strong>Empresa:</strong> ${ticket.empresa}</li>
          <li><strong>Serviço:</strong> ${ticket.descricaoServico}</li>
          <li><strong>Nota de Serviço:</strong> ${ticket.notaServico}</li>
          <li><strong>Data:</strong> ${ticket.createdAt}</li>
        </ul>
        <p>Responderemos em breve!</p>
      `;
      await sendTicketEmail(ticket.emailEmpresa, assunto, mensagem);
    }

    const adminAssunto = `Novo ticket criado - ${ticket.notaServico}`;
    const adminMensagem = `
      <p>Um novo ticket foi criado com os seguintes dados:</p>
      <ul>
        <li><strong>Cliente:</strong> ${ticket.cliente}</li>
        <li><strong>Empresa:</strong> ${ticket.empresa}</li>
        <li><strong>CPF:</strong> ${ticket.cpf || 'N/A'}</li>
        <li><strong>CNPJ:</strong> ${ticket.cnpj || 'N/A'}</li>
        <li><strong>Telefone:</strong> ${ticket.telefone || 'N/A'}</li>
        <li><strong>WhatsApp:</strong> ${ticket.whatsapp || 'N/A'}</li>
        <li><strong>Email:</strong> ${ticket.emailEmpresa || 'N/A'}</li>
        <li><strong>Serviço:</strong> ${ticket.descricaoServico}</li>
        <li><strong>Nota de Serviço:</strong> ${ticket.notaServico}</li>
        <li><strong>Data:</strong> ${ticket.createdAt}</li>
      </ul>
    `;
    await sendTicketEmail('luhmgasparetto@gmail.com', adminAssunto, adminMensagem);

    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
};

export const getTicketById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM tickets WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Ticket não encontrado' });
      return;
    }
    const ticket = result.rows[0];
    if (ticket.createdAt) {
      ticket.createdAt = format(new Date(ticket.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR });
    }
    res.json(ticket);
  } catch (err) {
    next(err);
  }
};

export const getTicketsByCliente = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { cliente } = req.params;
    const result = await pool.query('SELECT * FROM tickets WHERE cliente ILIKE $1 ORDER BY createdAt DESC', [`%${cliente}%`]);
    const tickets = result.rows.map(ticket => {
      if (ticket.createdAt) {
        ticket.createdAt = format(new Date(ticket.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR });
      }
      return ticket;
    });
    res.json(tickets);
  } catch (err) {
    next(err);
  }
};

export const getTicketByNota = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { notaServico } = req.params;
    const result = await pool.query('SELECT * FROM tickets WHERE notaServico = $1', [notaServico]);
    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Ticket não encontrado pela nota de serviço' });
      return;
    }
    const ticket = result.rows[0];
    if (ticket.createdAt) {
      ticket.createdAt = format(new Date(ticket.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR });
    }
    res.json(ticket);
  } catch (err) {
    next(err);
  }
};

export const getAllTickets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM tickets ORDER BY createdAt DESC');
    const tickets = result.rows.map(ticket => {
      if (ticket.createdAt) {
        ticket.createdAt = format(new Date(ticket.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR });
      }
      return ticket;
    });
    res.json(tickets);
  } catch (err) {
    next(err);
  }
};
