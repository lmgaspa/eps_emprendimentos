export interface Ticket {
  id: string;
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
