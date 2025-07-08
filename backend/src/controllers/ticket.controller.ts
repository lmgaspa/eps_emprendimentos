import { Request, Response, NextFunction } from "express";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Ticket from "../models/Ticket";
import { sendTicketEmail } from "../utils/emailService";

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

    // Envia email ao cliente (se houver)
    if (emailEmpresa) {
      const assunto = `Confirmação do Ticket - ${notaServico}`;
      const mensagem = `
        <p>Olá ${cliente},</p>
        <p>Seu ticket foi registrado com sucesso com os seguintes detalhes:</p>
        <ul>
          <li><strong>Empresa:</strong> ${empresa}</li>
          <li><strong>Cliente:</strong> ${cliente}</li>
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
      await sendTicketEmail(emailEmpresa, assunto, mensagem);
    }

    res.status(201).json({ ...saved.toObject(), createdAt: formattedDate });
  } catch (err) {
    next(err);
  }
};
