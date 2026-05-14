import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const nivelColor = {
  BASICO: '#00ff88',
  INTERMEDIO: '#ffaa00',
  AVANZADO: '#ff4444'
};

const RetoDetalle = () => {
  const { id } = useParams();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [reto, setReto] = useState(null);
  const [soluciones, setSoluciones] = useState([]);
  const [respuesta, setRespuesta] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [comentarios, setComentarios] = useState({});
  const [nuevoComentario, setNuevoComentario] = useState({});
  const [puntuacion, setPuntuacion] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/retos/${id}`);
        setReto(res.data.data);
        const sol = await api.get(`/soluciones/reto/${id}`);
        setSoluciones(sol.data.data);
      } catch (err) {
        setError('Error al cargar el reto');
      }
    };
    fetchData();
  }, [id]);

  const enviarSolucion = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    try {
      await api.post('/soluciones', { contenido_respuesta: respuesta, id_reto: parseInt(id) });
      setMensaje('✓ Solución enviada correctamente');
      setRespuesta('');
      const sol = await api.get(`/soluciones/reto/${id}`);
      setSoluciones(sol.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar solución');
    }
  };

  const eliminarReto = async () => {
    if (!window.confirm('¿Seguro que deseas eliminar este reto?')) return;
    try {
      await api.delete(`/retos/${id}`);
      navigate('/retos');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar reto');
    }
  };

  const cargarComentarios = async (id_solucion) => {
    try {
      const res = await api.get(`/comentarios/solucion/${id_solucion}`);
      setComentarios(prev => ({ ...prev, [id_solucion]: res.data.data }));
    } catch (err) {}
  };

  const enviarComentario = async (id_solucion) => {
    try {
      await api.post('/comentarios', { contenido: nuevoComentario[id_solucion], id_solucion });
      setNuevoComentario(prev => ({ ...prev, [id_solucion]: '' }));
      cargarComentarios(id_solucion);
    } catch (err) {}
  };

  const enviarEvaluacion = async (id_solucion) => {
    try {
      await api.post('/evaluaciones', { puntuacion: parseInt(puntuacion[id_solucion]), id_solucion });
      setMensaje('✓ Evaluación enviada correctamente');
      const sol = await api.get(`/soluciones/reto/${id}`);
      setSoluciones(sol.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al evaluar');
    }
  };

  if (!reto) return (
    <div style={{ textAlign: 'center', marginTop: '80px', color: '#00ff88' }}>
      Cargando...
    </div>
  );

  return (
    <div style={{ maxWidth: '850px', margin: '40px auto', padding: '20px' }}>
      <div style={{
        backgroundColor: '#0d0d1a',
        border: '1px solid #1a1a3e',
        borderLeft: `4px solid ${nivelColor[reto.nivel]}`,
        borderRadius: '6px',
        padding: '25px',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#e0e0e0', marginBottom: '10px' }}>{reto.titulo}</h2>
        <p style={{ color: '#888', marginBottom: '15px' }}>{reto.descripcion}</p>
        <div style={{ display: 'flex', gap: '20px', fontSize: '0.8rem', marginBottom: '15px' }}>
          <span style={{ color: nivelColor[reto.nivel] }}>● {reto.nivel}</span>
          <span style={{ color: '#555' }}>/{reto.categoria}</span>
          <span style={{ color: '#555' }}>by {reto.creador.nombre}</span>
        </div>
        {usuario && (reto.id_creador === usuario.id_usuario || usuario.rol === 'ADMIN') && (
          <button onClick={eliminarReto} style={{
            backgroundColor: 'transparent',
            color: '#ff4444',
            border: '1px solid #ff4444',
            padding: '6px 14px',
            fontSize: '0.8rem'
          }}>
            ELIMINAR RETO
          </button>
        )}
      </div>

      {error && (
        <div style={{ backgroundColor: '#1a0000', border: '1px solid #ff4444', color: '#ff4444', padding: '10px', borderRadius: '4px', marginBottom: '20px', fontSize: '0.85rem' }}>
          ⚠ {error}
        </div>
      )}
      {mensaje && (
        <div style={{ backgroundColor: '#001a0d', border: '1px solid #00ff88', color: '#00ff88', padding: '10px', borderRadius: '4px', marginBottom: '20px', fontSize: '0.85rem' }}>
          {mensaje}
        </div>
      )}

      {usuario && (
        <div style={{ backgroundColor: '#0d0d1a', border: '1px solid #1a1a3e', borderRadius: '6px', padding: '25px', marginBottom: '30px' }}>
          <h3 style={{ color: '#00ff88', marginBottom: '15px', fontSize: '1rem', letterSpacing: '1px' }}>&gt; ENVIAR SOLUCIÓN</h3>
          <form onSubmit={enviarSolucion}>
            <textarea
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              placeholder="Escribe tu solución aquí..."
              style={{ width: '100%', height: '120px', resize: 'vertical' }}
            />
            <button type="submit" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
              ENVIAR →
            </button>
          </form>
        </div>
      )}

      <div>
        <h3 style={{ color: '#00ff88', marginBottom: '20px', fontSize: '1rem', letterSpacing: '1px' }}>
          &gt; SOLUCIONES ({soluciones.length})
        </h3>
        {soluciones.length === 0 && <p style={{ color: '#555' }}>No hay soluciones aún. ¡Sé el primero!</p>}
        {soluciones.map((sol) => (
          <div key={sol.id_solucion} style={{
            backgroundColor: '#0d0d1a',
            border: '1px solid #1a1a3e',
            borderRadius: '6px',
            padding: '20px',
            marginBottom: '15px'
          }}>
            <p style={{ color: '#e0e0e0', marginBottom: '10px' }}>{sol.contenido_respuesta}</p>
            <div style={{ display: 'flex', gap: '15px', fontSize: '0.78rem', marginBottom: '15px' }}>
              <span style={{ color: '#00ff88' }}>by {sol.usuario.nombre}</span>
              <span style={{ color: '#555' }}>estado: {sol.estado}</span>
              <span style={{ color: '#ffaa00' }}>puntaje: {sol.puntaje_obtenido}</span>
            </div>

            {usuario && sol.id_usuario !== usuario.id_usuario && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
                <select
                  value={puntuacion[sol.id_solucion] || ''}
                  onChange={(e) => setPuntuacion(prev => ({ ...prev, [sol.id_solucion]: e.target.value }))}
                  style={{ width: 'auto', marginBottom: 0, padding: '6px' }}
                >
                  <option value="">Puntuar</option>
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} ★</option>)}
                </select>
                <button onClick={() => enviarEvaluacion(sol.id_solucion)} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                  EVALUAR
                </button>
              </div>
            )}

            <button
              onClick={() => cargarComentarios(sol.id_solucion)}
              style={{ backgroundColor: 'transparent', color: '#555', border: '1px solid #1a1a3e', padding: '4px 10px', fontSize: '0.75rem', marginBottom: '10px' }}
            >
              VER COMENTARIOS
            </button>

            {comentarios[sol.id_solucion] && (
              <div style={{ marginTop: '10px' }}>
                {comentarios[sol.id_solucion].map(c => (
                  <div key={c.id_comentario} style={{ borderLeft: '2px solid #1a1a3e', paddingLeft: '10px', marginBottom: '8px' }}>
                    <p style={{ color: '#888', fontSize: '0.85rem' }}>{c.contenido}</p>
                    <span style={{ color: '#555', fontSize: '0.75rem' }}>— {c.usuario.nombre}</span>
                  </div>
                ))}
                {usuario && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <input
                      type="text"
                      placeholder="Agregar comentario..."
                      value={nuevoComentario[sol.id_solucion] || ''}
                      onChange={(e) => setNuevoComentario(prev => ({ ...prev, [sol.id_solucion]: e.target.value }))}
                      style={{ flex: 1, marginBottom: 0, padding: '6px' }}
                    />
                    <button onClick={() => enviarComentario(sol.id_solucion)} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                      COMENTAR
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RetoDetalle;