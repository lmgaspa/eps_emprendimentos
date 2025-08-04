import { Request, Response, NextFunction } from "express";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Ticket from "../models/Ticket";
import { sendTicketEmail } from "../utils/emailService";
import { sendWhatsappMessage } from "../utils/whatsappService";

export const createTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
      createdAt,
    });

    const saved = await newTicket.save();

    const formattedDate = format(
      saved.createdAt ?? new Date(),
      "dd/MM/yyyy HH:mm",
      { locale: ptBR }
    );

    // Mensagem unificada (usada para email e WhatsApp)
    const mensagem = `
      <p>Sua nota de serviço foi registrada com sucesso com os seguintes detalhes:</p>
      <ul>
        <li><strong>Cliente:</strong> ${cliente}</li>
        <li><strong>Empresa:</strong> ${empresa}</li>
        <li><strong>CPF:</strong> ${cpf || "N/A"}</li>
        <li><strong>CNPJ:</strong> ${cnpj || "N/A"}</li>
        <li><strong>Telefone:</strong> ${telefone || "N/A"}</li>
        <li><strong>WhatsApp:</strong> ${whatsapp || "N/A"}</li>
        <li><strong>E-mail:</strong> ${emailEmpresa}</li>
        <li><strong>Título:</strong> ${descricaoServico}</li>
        <li><strong>Nota de Serviço:</strong> ${notaServico}</li>
        <li><strong>Data:</strong> ${formattedDate}</li>
      </ul>
      <p>Responderemos em breve!</p>
    `;

    // Envia o e-mail
    if (emailEmpresa) {
      const assunto = `Confirmação do Ticket - ${notaServico}`;
      await sendTicketEmail(emailEmpresa, assunto, mensagem);
    }

    // Envia o WhatsApp (mensagem convertida para texto plano)
    if (whatsapp) {
      const mensagemWhatsapp = `
Sua nota de serviço foi registrada com sucesso com os seguintes detalhes:

• Cliente: ${cliente}
• Empresa: ${empresa}
• CPF: ${cpf || "N/A"}
• CNPJ: ${cnpj || "N/A"}
• Telefone: ${telefone || "N/A"}
• WhatsApp: ${whatsapp || "N/A"}
• E-mail: ${emailEmpresa}
• Título: ${descricaoServico}
• Nota de Serviço: ${notaServico}
• Data: ${formattedDate}

Responderemos em breve!
      `;
      await sendWhatsappMessage(whatsapp, mensagemWhatsapp.trim());
    }

    res.status(201).json({ ...saved.toObject(), createdAt: formattedDate });
  } catch (err) {
    next(err);
  }
};
