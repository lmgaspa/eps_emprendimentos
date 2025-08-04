export const swaggerDocs = {
  openapi: "3.0.0",
  info: {
    title: "API de Chamados EPS",
    version: "1.0.0",
    description: "API para registro e acompanhamento de chamados",
  },
  servers: [
    { url: "https://eps-6c85169e1d63.herokuapp.com" },
    { url: "https://eps-emprendimentos.vercel.app" },
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
          descricaoServico: { type: "string", example: "Erro na geração de relatórios" },
        },
      },
      TicketOutput: {
        allOf: [
          { $ref: "#/components/schemas/TicketInput" },
          {
            type: "object",
            properties: {
              _id: { type: "string", example: "665f7cba1e4f230d58bfa1ee" },
              notaServico: { type: "string", example: "NS-1751907481293" },
              createdAt: { type: "string", example: "2025-06-16 07:00" },
            },
          },
        ],
      },
      TicketUpdate: {
        type: "object",
        properties: {
          cliente: { type: "string" },
          empresa: { type: "string" },
          descricaoServico: { type: "string" },
          telefone: { type: "string" },
          whatsapp: { type: "string" },
          emailEmpresa: { type: "string" },
          cpf: { type: "string" },
          cnpj: { type: "string" },
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
    "/api/tickets": {
      post: {
        tags: ["Tickets"],
        summary: "Cria um novo ticket",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TicketInput" },
            },
          },
        },
        responses: {
          201: {
            description: "Ticket criado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TicketOutput" },
              },
            },
          },
        },
      },
    },
    "/api/tickets/all": {
      get: {
        tags: ["Tickets"],
        summary: "Lista todos os tickets",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Tickets retornados com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/TicketOutput" },
                },
              },
            },
          },
        },
      },
    },
    "/api/tickets/{campo}/{valor}": {
      put: {
        tags: ["Tickets"],
        summary: "Atualiza ticket por campo (total)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "campo", in: "path", required: true, schema: { type: "string" } },
          { name: "valor", in: "path", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TicketUpdate" },
            },
          },
        },
        responses: {
          200: { description: "Ticket atualizado com sucesso" },
          404: { description: "Ticket não encontrado" },
        },
      },
      patch: {
        tags: ["Tickets"],
        summary: "Atualiza ticket por campo (parcial)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "campo", in: "path", required: true, schema: { type: "string" } },
          { name: "valor", in: "path", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TicketUpdate" },
            },
          },
        },
        responses: {
          200: { description: "Ticket atualizado parcialmente com sucesso" },
          404: { description: "Ticket não encontrado" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Autenticação"],
        summary: "Login de funcionário ou admin",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "admin@eps.com" },
                  password: { type: "string", example: "123456" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Token JWT retornado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string", example: "Bearer abc123..." },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Autenticação"],
        summary: "Registro de novo usuário (apenas admin)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", example: "funcionario@eps.com" },
                  password: { type: "string", example: "123456" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Usuário registrado com sucesso" },
          403: { description: "Apenas administradores podem registrar usuários" },
        },
      },
    },
  },
};
