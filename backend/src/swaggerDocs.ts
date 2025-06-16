/**
 * Documentação Swagger centralizada
 */
export const swaggerDocs = {
  openapi: '3.0.0',
  info: {
    title: 'API de Chamados EPS',
    version: '1.0.0',
    description: 'API para registro e acompanhamento de chamados',
  },
  servers: [
    { url: 'http://localhost:3000' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    },
    schemas: {
      TicketInput: {
        type: 'object',
        required: ['cliente', 'empresa', 'descricaoServico'],
        properties: {
          cliente: { type: 'string', example: 'João da Silva' },
          empresa: { type: 'string', example: 'Empresa XYZ LTDA' },
          cpf: { type: 'string', example: '123.456.789-00' },
          cnpj: { type: 'string', example: '12.345.678/0001-99' },
          emailEmpresa: { type: 'string', example: 'contato@empresa.com' },
          telefone: { type: 'string', example: '(71)3212-1229' },
          whatsapp: { type: 'string', example: '(73)99410-5740' },
          descricaoServico: { type: 'string', example: 'Erro na geração de relatórios' },
        },
      },
      TicketOutput: {
        allOf: [
          { $ref: '#/components/schemas/TicketInput' },
          {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '665f7cba1e4f230d58bfa1ee' },
              notaServico: { type: 'string', example: 'NS-1721220000000' },
              createdAt: { type: 'string', format: 'date-time', example: '2025-06-16 07:00' }
            }
          }
        ]
      }
    }
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: 'Tickets', description: 'Gerenciamento de chamados' },
    { name: 'Autenticação', description: 'Login e registro de usuários' },
  ],
  paths: {
    '/tickets': {
      post: {
        tags: ['Tickets'],
        summary: 'Cria um novo ticket',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TicketInput' }
            }
          }
        },
        responses: {
          201: {
            description: 'Ticket criado com sucesso',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TicketOutput' }
              }
            }
          }
        }
      }
    },
    '/tickets/cliente/{cliente}': {
      get: {
        tags: ['Tickets'],
        summary: 'Busca tickets por cliente',
        parameters: [
          {
            name: 'cliente',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: { 200: { description: 'Lista de tickets' } }
      }
    },
    '/tickets/nota/{notaServico}': {
      get: {
        tags: ['Tickets'],
        summary: 'Busca ticket pela nota de serviço',
        parameters: [
          {
            name: 'notaServico',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: { 200: { description: 'Ticket encontrado' } }
      }
    },
    '/tickets/all': {
      get: {
        tags: ['Tickets'],
        summary: 'Lista todos os tickets (admin)',
        responses: { 200: { description: 'Todos os tickets' } }
      }
    },
    '/tickets/{id}': {
      get: {
        tags: ['Tickets'],
        summary: 'Busca ticket por ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' }
          }
        ],
        responses: { 200: { description: 'Ticket encontrado' } }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Autenticação'],
        summary: 'Login de funcionário',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'admin@eps.com' },
                  password: { type: 'string', example: '123456' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login realizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string', example: 'Bearer abc123...' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/auth/register': {
      post: {
        tags: ['Autenticação'],
        summary: 'Registra um novo funcionário (somente admin)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string', example: 'Novo Funcionário' },
                  email: { type: 'string', example: 'novo@eps.com' },
                  password: { type: 'string', example: '123456' },
                  role: { type: 'string', enum: ['admin', 'user'], example: 'user' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Funcionário registrado com sucesso' },
          403: { description: 'Acesso negado' }
        }
      }
    }
  }
};
