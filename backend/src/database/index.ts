import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.URI;

if (!uri) {
  console.error('❌ A variável de ambiente URI não está definida.');
  process.exit(1);
}

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(uri as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as any);
    console.log('✅ Conectado ao MongoDB com sucesso');
  } catch (error) {
    console.error('❌ Erro ao conectar no MongoDB:', error);
    process.exit(1);
  }
}
