import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

export async function sendWhatsAppMessage(to: string, message: string) {
  try {
    const formatted = to.replace(/\D/g, '') // limpa não números
    const fullNumber = `55${formatted}`

    await axios.post('https://api.callmebot.com/whatsapp.php', null, {
      params: {
        phone: fullNumber,
        text: message,
        apikey: 'free', // Use uma API real se necessário
      },
    })
  } catch (err: unknown) {
    const error = err as Error
    console.error('Erro ao enviar WhatsApp:', error.message)
  }
}
