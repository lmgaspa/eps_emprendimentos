import express from 'express';
import cors from 'cors';
import { connectDB } from './database';
import authRoutes from './routes/auth.routes';
import ticketRoutes from './routes/ticket.routes';
import setupSwagger from './swagger';

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

connectDB();

app.use('/auth', authRoutes);
app.use('/tickets', ticketRoutes);
setupSwagger(app);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
