import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index';

dotenv.config();

const app: Application = express();

// Middlewares
app.use(cors({
  origin: 'https://eps-emprendimentos.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());

// Rotas da API
app.use('/api', routes);

export default app;
