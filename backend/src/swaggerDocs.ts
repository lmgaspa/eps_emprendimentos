/**
 * Documentação Swagger centralizada
 */
export const swaggerDocs = {
  openapi: "3.0.0",
  info: {
    title: "API de Chamados EPS",
    version: "1.0.0",
    description: "API para registro e acompanhamento de chamados",
  },
  servers: [
    { url: "https://eps-emprendimentos.onrender.com" },
    { url: "http://localhost:3000" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      TicketInput: {
        type: "object",
        required: ["cliente", "empresa", "descricaoServico"],
        properties: {
          cliente: { type: "string", example: "João da Silva" },
          empresa: { type: "string", example: "Empresa XYZ LTDA" },
          cpf: { type: "string", example: "123.456.789-00" },
          cnpj: { type: "string", example: "12.345.678/0001-99" },
          emailEmpresa: { type: "string", example: "contato@empresa.com" },
          telefone: { type: "string", example: "(71)3212-1229" },
          whatsapp: { type: "string", example: "(73)99410-5740" },
          descricaoServico: {
            type: "string",
            example: "Erro na geração de relatórios",
          },
        },
      },
      TicketOutput: {
        allOf: [
          { $ref: "#/components/schemas/TicketInput" },
          {
            type: "object",
            properties: {
              _id: { type: "string", example: "665f7cba1e4f230d58bfa1ee" },
              notaServico: { type: "string", example: "NS-1721220000000" },
              createdAt: {
                type: "string",
                format: "date-time",
                example: "2025-06-16 07:00",
              },
            },
          },
        ],
      },
      Ticket: {
        type: "object",
        properties: {
          notaServico: { type: "string" },
          cliente: { type: "string" },
          empresa: { type: "string" },
          cpf: { type: "string" },
          cnpj: { type: "string" },
          emailEmpresa: { type: "string" },
          telefone: { type: "string" },
          whatsapp: { type: "string" },
          descricaoServico: { type: "string" },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  tags: [
    { name: "Tickets", description: "Gerenciamento de chamados" },
    { name: "Autenticação", description: "Login e registro de usuários" },
  ],
  paths: {
    "/api/tickets/cpf/{cpf}": {
      put: {
        tags: ["Tickets"],
        summary: "Atualiza ticket por cpf (PUT)",
        parameters: [
          { name: "cpf", in: "path", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Ticket" }
            }
          }
        },
        responses: { '200': { description: "Ticket atualizado com sucesso" } }
      },
      patch: {
        tags: ["Tickets"],
        summary: "Atualiza ticket por cpf (PATCH)",
        parameters: [
          { name: "cpf", in: "path", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Ticket" }
            }
          }
        },
        responses: { '200': { description: "Ticket atualizado com sucesso" } }
      }
    },
    "/api/tickets/cnpj/{cnpj}": {
      put: {
        tags: ["Tickets"],
        summary: "Atualiza ticket por cnpj (PUT)",
        parameters: [
          { name: "cnpj", in: "path", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Ticket" }
            }
          }
        },
        responses: { '200': { description: "Ticket atualizado com sucesso" } }
      },
      patch: {
        tags: ["Tickets"],
        summary: "Atualiza ticket por cnpj (PATCH)",
        parameters: [
          { name: "cnpj", in: "path", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Ticket" }
            }
          }
        },
        responses: { '200': { description: "Ticket atualizado com sucesso" } }
      }
    },
    "/api/tickets/email/{email}": {
      put: {
        tags: ["Tickets"],
        summary: "Atualiza ticket por email (PUT)",
        parameters: [
          { name: "email", in: "path", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Ticket" }
            }
          }
        },
        responses: { '200': { description: "Ticket atualizado com sucesso" } }
      },
      patch: {
        tags: ["Tickets"],
        summary: "Atualiza ticket por email (PATCH)",
        parameters: [
          { name: "email", in: "path", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Ticket" }
            }
          }
        },
        responses: { '200': { description: "Ticket atualizado com sucesso" } }
      }
    }
  }
};
