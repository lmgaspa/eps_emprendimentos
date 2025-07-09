import twilio from 'twilio';

const client = twilio(
  'AC5e638108469dd4b263b09ca569763ac9', // SID da conta Twilio
  '65d4d6019eb7b5e50ae85b76058c30b1'     // Auth Token
);

client.messages
  .create({
    from: 'whatsapp:+14155238886',        // Número do Twilio Sandbox
    to: 'whatsapp:+5571994105740',         // Seu número com DDI e DDD
    body: '🚀 Teste automático funcionando!',
  })
  .then(message => console.log(`✅ Mensagem enviada! SID: ${message.sid}`))
  .catch(err => console.error('❌ Erro ao enviar:', err));
