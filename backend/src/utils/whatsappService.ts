import { Twilio } from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const client = new Twilio(
  process.env.TWILIO_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export const sendWhatsappMessage = async (to: string, body: string): Promise<void> => {
  try {
    const cleaned = to.replace(/\D/g, '');
    const fullNumber = `whatsapp:+55${cleaned}`; // sempre adiciona +55 na frente

    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM!,
      to: fullNumber,
      body,
    });

    console.log(`✅ Mensagem enviada! SID: ${message.sid}`);
  } catch (err) {
    console.error("❌ Erro ao enviar mensagem via WhatsApp:", err);
  }
};
