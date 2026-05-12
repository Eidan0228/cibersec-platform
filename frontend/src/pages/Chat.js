import React, { useState } from 'react';
import api from '../services/api';

const Chat = () => {
  const [mensaje, setMensaje] = useState('');
  const [conversacion, setConversacion] = useState([]);
  const [cargando, setCargando] = useState(false);

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!mensaje.trim()) return;

    const nuevaConversacion = [...conversacion, { rol: 'usuario', texto: mensaje }];
    setConversacion(nuevaConversacion);
    setMensaje('');
    setCargando(true);

    try {
      const res = await api.post('/chat', { mensaje });
      setConversacion([...nuevaConversacion, { rol: 'bot', texto: res.data.data.respuesta }]);
    } catch (err) {
      setConversacion([...nuevaConversacion, { rol: 'bot', texto: 'Error al obtener respuesta.' }]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '20px' }}>
      <h2>Asistente de Ciberseguridad</h2>
      <div style={{ border: '1px solid #ccc', borderRadius: '5px', height: '400px', overflowY: 'auto', padding: '15px', marginBottom: '15px' }}>
        {conversacion.length === 0 && <p style={{ color: '#888' }}>Haz una pregunta sobre ciberseguridad o redes...</p>}
        {conversacion.map((msg, index) => (
          <div key={index} style={{ marginBottom: '15px', textAlign: msg.rol === 'usuario' ? 'right' : 'left' }}>
            <span style={{
              display: 'inline-block',
              padding: '10px',
              borderRadius: '10px',
              backgroundColor: msg.rol === 'usuario' ? '#007bff' : '#f0f0f0',
              color: msg.rol === 'usuario' ? 'white' : 'black',
              maxWidth: '80%'
            }}>
              {msg.texto}
            </span>
          </div>
        ))}
        {cargando && <p style={{ color: '#888' }}>Respondiendo...</p>}
      </div>
      <form onSubmit={enviarMensaje} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe tu pregunta..."
          style={{ flex: 1, padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Enviar</button>
      </form>
    </div>
  );
};

export default Chat;