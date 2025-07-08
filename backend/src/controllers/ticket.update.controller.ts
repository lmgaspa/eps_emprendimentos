import { Request, Response } from 'express';
import Ticket from '../models/Ticket';
import dotenv from 'dotenv';
import { sendTicketEmail } from '../utils/emailService';
import { sendWhatsAppMessage } from '../utils/whatsappService';

dotenv.config();

export const patchTicketByNotaServico = async (req: Request, res: Response) => {
  const { notaServico } = req.params;

  try {
    const existingTicket = await Ticket.findOne({ notaServico });
    if (!existingTicket) {
      return res.status(404).json({ message: 'Ticket não encontrado.' });
    }

    const wasDescricaoChanged = req.body.descricaoServico && req.body.descricaoServico !== existingTicket.descricaoServico;

    const updatedTicket = await Ticket.findOneAndUpdate(
      { notaServico },
      { $set: req.body },
      { new: true }
    );

    if (wasDescricaoChanged && updatedTicket) {
      // Email
      if (updatedTicket.emailEmpresa) {
        await sendTicketEmail(
          updatedTicket.emailEmpresa,
          'Atualização do Título do Chamado',
          `O título do seu chamado (${updatedTicket.notaServico}) foi atualizado para: <strong>${updatedTicket.descricaoServico}</strong>`
        );
      }

      // WhatsApp
      if (updatedTicket.whatsapp) {
        const numero = process.env.WHATSAPP_PHONE?.replace(/\D/g, '');
        if (numero) {
          await sendWhatsAppMessage(
            numero,
            `⚠️ O título do chamado ${updatedTicket.notaServico} foi atualizado para:\n\n"${updatedTicket.descricaoServico}"`
          );
        }
      }
    }

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar ticket.', error });
  }
};

export const putTicketByNotaServico = async (req: Request, res: Response) => {
  const { notaServico } = req.params;

  try {
    const existingTicket = await Ticket.findOne({ notaServico });
    if (!existingTicket) {
      return res.status(404).json({ message: 'Ticket não encontrado.' });
    }

    const wasDescricaoChanged = req.body.descricaoServico && req.body.descricaoServico !== existingTicket.descricaoServico;

    const updatedTicket = await Ticket.findOneAndReplace(
      { notaServico },
      req.body,
      { new: true }
    );

    if (wasDescricaoChanged && updatedTicket) {
      // Email
      if (updatedTicket.emailEmpresa) {
        await sendTicketEmail(
          updatedTicket.emailEmpresa,
          'Atualização do Título do Chamado',
          `O título do seu chamado (${updatedTicket.notaServico}) foi atualizado para: <strong>${updatedTicket.descricaoServico}</strong>`
        );
      }

      // WhatsApp
      if (updatedTicket.whatsapp) {
        const numero = process.env.WHATSAPP_PHONE?.replace(/\D/g, '');
        if (numero) {
          await sendWhatsAppMessage(
            numero,
            `⚠️ O título do chamado ${updatedTicket.notaServico} foi atualizado para:\n\n"${updatedTicket.descricaoServico}"`
          );
        }
      }
    }

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao substituir ticket.', error });
  }
};
