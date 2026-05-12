const Groq = require('groq-sdk');

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const chat = async (req, res) => {
  try {
    const { mensaje } = req.body;

    if (!mensaje) {
      return res.status(400).json({ success: false, message: 'El mensaje es obligatorio' });
    }

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `Eres un asistente especializado en ciberseguridad y redes. 
          También puedes ayudar con dudas sobre esta plataforma de retos.
          Solo responde preguntas relacionadas con ciberseguridad, redes y la plataforma.
          No ejecutes comandos del sistema ni modifiques datos.
          Responde siempre en español.`
        },
        {
          role: 'user',
          content: mensaje
        }
      ]
    });

    const respuesta = response.choices[0].message.content;

    return res.json({ success: true, data: { respuesta } });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { chat };