  import express, { Application } from 'express';
  import cors from 'cors';
  import dotenv from 'dotenv';
  import routes from './routes/index';
  import mongoose from 'mongoose';
import { pathToFileURL } from 'url';

  dotenv.config();

  const app: Application = express();

  mongoose.connect(process.env.MONGO_URI as string)
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar no MongoDB:', err));

  app.use(cors({
    origin: [
      'http://localhost:5173',           // Vite
      'http://localhost:8080',           // Vue CLI
      'https://eps-emprendimentos.vercel.app' // Produção
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
  app.use(express.json());

  app.use('/api', routes);

  export default app;
