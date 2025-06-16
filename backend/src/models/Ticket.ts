import mongoose, { Document, Schema } from 'mongoose';

export interface TicketDocument extends Document {
  cliente: string;
  empresa: string;
  cpf?: string;
  cnpj?: string;
  emailEmpresa?: string;
  telefone?: string;
  whatsapp?: string;
  descricaoServico: string;
  notaServico: string;
  createdAt?: Date;
}

const TicketSchema = new Schema<TicketDocument>({
  cliente: { type: String, required: true },
  empresa: { type: String, required: true },
  cpf: { type: String },
  cnpj: { type: String },
  emailEmpresa: { type: String },
  telefone: { type: String },
  whatsapp: { type: String },
  descricaoServico: { type: String, required: true },
  notaServico: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<TicketDocument>('Ticket', TicketSchema);
