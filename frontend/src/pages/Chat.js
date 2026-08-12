import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { useLang } from '../context/LangContext';

const Chat = () => {
  const { t } = useLang();
  const [mensaje, setMensaje] = useState('');
  const [conversacion, setConversacion] = useState([
    { rol: 'bot', texto: '> Sistema iniciado. Soy tu asistente de ciberseguridad. ¿En qué puedo ayudarte?' }
  ]);
  const [cargando, setCargando] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversacion]);

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
      setConversacion([...nuevaConversacion, { rol: 'bot', texto: '⚠ Error al obtener respuesta.' }]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h2 style={{ color: 'var(--accent)', fontSize: '1.4rem', letterSpacing: '2px', marginBottom: '5px' }}>
        {t('asistente')}
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '20px' }}>
        Powered by LLaMA 3.3 · Solo responde sobre ciberseguridad, redes y la plataforma
      </p>

      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        height: '450px',
        overflowY: 'auto',
        padding: '20px',
        marginBottom: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        {conversacion.map((msg, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: msg.rol === 'usuario' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '75%',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: msg.rol === 'usuario' ? 'var(--bg-tertiary)' : 'var(--bg-primary)',
              border: `1px solid ${msg.rol === 'usuario' ? 'var(--accent)' : 'var(--border-color)'}`,
              color: msg.rol === 'usuario' ? 'var(--accent)' : 'var(--text-primary)',
              fontSize: '0.88rem',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.rol === 'bot' && (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block', marginBottom: '4px' }}>
                  ASISTENTE
                </span>
              )}
              {msg.texto}
            </div>
          </div>
        ))}
        {cargando && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {t('procesando')}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={enviarMensaje} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder={t('escribePregunta')}
          style={{ flex: 1, marginBottom: 0 }}
          disabled={cargando}
        />
        <button type="submit" disabled={cargando} style={{ padding: '10px 20px', fontSize: '0.85rem', opacity: cargando ? 0.5 : 1 }}>
          {t('enviar')}
        </button>
      </form>
    </div>
  );
};

export default Chat;