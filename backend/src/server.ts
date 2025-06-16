import express from 'express';
import cors from 'cors';
import { connectDB } from './database';
import authRoutes from './routes/auth.routes';
import ticketRoutes from './routes/ticket.routes';

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// CORS extra (opcional)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // ajuste aqui se quiser restringir por domínio
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Conectar ao MongoDB
connectDB();

// Rotas
app.use('/auth', authRoutes);
app.use('/tickets', ticketRoutes);

// Inicializa servidor
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
