import { Request, Response } from 'express';
import Ticket from '../models/Ticket';
import { sendTicketEmail } from '../utils/emailService';
import { sendWhatsappMessage } from '../utils/whatsappService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import dotenv from 'dotenv';

dotenv.config();

const generateFormattedMessage = (ticket: any): { email: string; whatsapp: string } => {
  const formattedDate = format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR });

  const emailHtml = `
    <p>Sua nota de serviço foi atualizada com os seguintes dados:</p>
    <ul>
      <li><strong>Cliente:</strong> ${ticket.cliente}</li>
      <li><strong>Empresa:</strong> ${ticket.empresa}</li>
      <li><strong>CPF:</strong> ${ticket.cpf || 'N/A'}</li>
      <li><strong>CNPJ:</strong> ${ticket.cnpj || 'N/A'}</li>
      <li><strong>Telefone:</strong> ${ticket.telefone || 'N/A'}</li>
      <li><strong>WhatsApp:</strong> ${ticket.whatsapp || 'N/A'}</li>
      <li><strong>E-mail:</strong> ${ticket.emailEmpresa}</li>
      <li><strong>Título:</strong> ${ticket.descricaoServico}</li>
      <li><strong>Nota de Serviço:</strong> ${ticket.notaServico}</li>
      <li><strong>Data:</strong> ${formattedDate}</li>
    </ul>
    <p>Responderemos em breve!</p>
  `;

  const whatsappText = `
Sua nota de serviço foi atualizada com os seguintes dados:

• Cliente: ${ticket.cliente}
• Empresa: ${ticket.empresa}
• CPF: ${ticket.cpf || 'N/A'}
• CNPJ: ${ticket.cnpj || 'N/A'}
• Telefone: ${ticket.telefone || 'N/A'}
• WhatsApp: ${ticket.whatsapp || 'N/A'}
• E-mail: ${ticket.emailEmpresa}
• Título: ${ticket.descricaoServico}
• Nota de Serviço: ${ticket.notaServico}
• Data: ${formattedDate}

Responderemos em breve!
  `.trim();

  return { email: emailHtml, whatsapp: whatsappText };
};

// PATCH – Atualização parcial
export const patchTicketByNotaServico = async (req: Request, res: Response): Promise<void> => {
  const { notaServico } = req.params;

  try {
    const updatedTicket = await Ticket.findOneAndUpdate(
      { notaServico },
      { $set: req.body },
      { new: true }
    );

    if (!updatedTicket) {
      res.status(404).json({ message: 'Ticket não encontrado.' });
      return;
    }

    if (req.body.descricaoServico || req.body.status || req.body.cliente) {
      const { email, whatsapp } = generateFormattedMessage(updatedTicket);

      if (updatedTicket.emailEmpresa) {
        await sendTicketEmail(
          updatedTicket.emailEmpresa,
          `Atualização do Ticket - ${updatedTicket.notaServico}`,
          email
        );
      }

      if (updatedTicket.whatsapp) {
        await sendWhatsappMessage(updatedTicket.whatsapp, whatsapp);
      }
    }

    res.json(updatedTicket);
  } catch (error) {
    console.error('Erro ao atualizar ticket (PATCH):', error);
    res.status(500).json({ message: 'Erro ao atualizar ticket.', error });
  }
};

// PUT – Atualização total
export const putTicketByNotaServico = async (req: Request, res: Response): Promise<void> => {
  const { notaServico } = req.params;

  try {
    const updatedTicket = await Ticket.findOneAndUpdate(
      { notaServico },
      req.body, // substitui por completo os dados
      { new: true }
    );

    if (!updatedTicket) {
      res.status(404).json({ message: 'Ticket não encontrado.' });
      return;
    }

    const { email, whatsapp } = generateFormattedMessage(updatedTicket);

    if (updatedTicket.emailEmpresa) {
      await sendTicketEmail(
        updatedTicket.emailEmpresa,
        `Atualização do Ticket - ${updatedTicket.notaServico}`,
        email
      );
    }

    if (updatedTicket.whatsapp) {
      await sendWhatsappMessage(updatedTicket.whatsapp, whatsapp);
    }

    res.json(updatedTicket);
  } catch (error) {
    console.error('Erro ao atualizar ticket (PUT):', error);
    res.status(500).json({ message: 'Erro ao atualizar ticket.', error });
  }
};
