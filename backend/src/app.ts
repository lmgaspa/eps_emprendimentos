import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index';
import mongoose from 'mongoose';

dotenv.config();

const app: Application = express();

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch(err => console.error('❌ Erro ao conectar no MongoDB:', err));

// Middlewares
app.use(cors({
  origin: 'https://eps-emprendimentos.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// Rotas
app.use('/api', routes);

export default app;
