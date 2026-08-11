import React, { useEffect, useState } from 'react';
import api from '../services/api';

const estadoColor = {
  PENDIENTE: '#ffaa00',
  APROBADO: '#00ff88',
  RECHAZADO: '#ff4444'
};

const nivelColor = {
  BASICO: '#00ff88',
  INTERMEDIO: '#ffaa00',
  AVANZADO: '#ff4444'
};

const Perfil = () => {
  const [perfil, setPerfil] = useState(null);
  const [vista, setVista] = useState('stats');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const res = await api.get('/perfil');
        setPerfil(res.data.data);
      } catch (err) {
        setError('Error al cargar el perfil');
      }
    };
    fetchPerfil();
  }, []);

  if (error) return <p style={{ color: '#ff4444', textAlign: 'center', marginTop: '40px' }}>{error}</p>;
  if (!perfil) return <p style={{ color: '#00ff88', textAlign: 'center', marginTop: '40px' }}>Cargando...</p>;

  const aprobadas = perfil.soluciones.filter(s => s.estado === 'APROBADO').length;
  const pendientes = perfil.soluciones.filter(s => s.estado === 'PENDIENTE').length;
  const rechazadas = perfil.soluciones.filter(s => s.estado === 'RECHAZADO').length;

  return (
    <div style={{ maxWidth: '850px', margin: '40px auto', padding: '20px' }}>
      <div style={{ backgroundColor: '#0d0d1a', border: '1px solid #00ff88', borderRadius: '8px', padding: '25px', marginBottom: '25px' }}>
        <h2 style={{ color: '#00ff88', fontSize: '1.4rem', letterSpacing: '2px', marginBottom: '5px' }}>
          &gt; {perfil.nombre}
        </h2>
        <p style={{ color: '#555', fontSize: '0.85rem', marginBottom: '5px' }}>{perfil.correo}</p>
        <p style={{ color: '#555', fontSize: '0.8rem', marginBottom: '15px' }}>
          Miembro desde {new Date(perfil.fecha_registro).toLocaleDateString()}
          {perfil.rol === 'ADMIN' && <span style={{ color: '#ff4444', marginLeft: '10px' }}>[ADMIN]</span>}
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#00ff88', fontSize: '1.5rem', fontWeight: 'bold' }}>{perfil.puntos_totales}</p>
            <p style={{ color: '#555', fontSize: '0.75rem' }}>PUNTOS</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#00ff88', fontSize: '1.5rem', fontWeight: 'bold' }}>{perfil._count.retos_creados}</p>
            <p style={{ color: '#555', fontSize: '0.75rem' }}>RETOS</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#00ff88', fontSize: '1.5rem', fontWeight: 'bold' }}>{perfil._count.soluciones}</p>
            <p style={{ color: '#555', fontSize: '0.75rem' }}>SOLUCIONES</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#00ff88', fontSize: '1.5rem', fontWeight: 'bold' }}>{perfil._count.comentarios}</p>
            <p style={{ color: '#555', fontSize: '0.75rem' }}>COMENTARIOS</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['stats', 'soluciones', 'retos'].map(v => (
          <button key={v} onClick={() => setVista(v)} style={{
            padding: '8px 18px',
            fontSize: '0.85rem',
            backgroundColor: vista === v ? '#00ff88' : 'transparent',
            color: vista === v ? '#0a0a0f' : '#00ff88',
            border: '1px solid #00ff88'
          }}>
            {v === 'stats' ? 'ESTADÍSTICAS' : v === 'soluciones' ? 'SOLUCIONES' : 'RETOS CREADOS'}
          </button>
        ))}
      </div>

      {vista === 'stats' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
          {[
            { label: 'Aprobadas', valor: aprobadas, color: '#00ff88' },
            { label: 'Pendientes', valor: pendientes, color: '#ffaa00' },
            { label: 'Rechazadas', valor: rechazadas, color: '#ff4444' }
          ].map(stat => (
            <div key={stat.label} style={{ backgroundColor: '#0d0d1a', border: `1px solid ${stat.color}`, borderRadius: '6px', padding: '20px', textAlign: 'center' }}>
              <p style={{ color: stat.color, fontSize: '2rem', fontWeight: 'bold' }}>{stat.valor}</p>
              <p style={{ color: '#555', fontSize: '0.8rem' }}>SOLUCIONES {stat.label.toUpperCase()}</p>
            </div>
          ))}
        </div>
      )}

      {vista === 'soluciones' && (
        <div style={{ display: 'grid', gap: '10px' }}>
          {perfil.soluciones.length === 0 && <p style={{ color: '#555' }}>No has enviado soluciones aún.</p>}
          {perfil.soluciones.map(s => (
            <div key={s.id_solucion} style={{ backgroundColor: '#0d0d1a', border: '1px solid #1a1a3e', borderLeft: `4px solid ${estadoColor[s.estado]}`, borderRadius: '6px', padding: '15px 20px' }}>
              <p style={{ color: '#e0e0e0', marginBottom: '5px' }}>{s.contenido_respuesta}</p>
              <div style={{ display: 'flex', gap: '15px', fontSize: '0.78rem' }}>
                <span style={{ color: '#555' }}>Reto: {s.reto.titulo}</span>
                <span style={{ color: estadoColor[s.estado] }}>● {s.estado}</span>
                <span style={{ color: '#ffaa00' }}>★ {s.puntaje_obtenido}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {vista === 'retos' && (
        <div style={{ display: 'grid', gap: '10px' }}>
          {perfil.retos_creados.length === 0 && <p style={{ color: '#555' }}>No has creado retos aún.</p>}
          {perfil.retos_creados.map(r => (
            <div key={r.id_reto} style={{ backgroundColor: '#0d0d1a', border: '1px solid #1a1a3e', borderLeft: `4px solid ${nivelColor[r.nivel]}`, borderRadius: '6px', padding: '15px 20px' }}>
              <p style={{ color: '#e0e0e0', fontWeight: 'bold' }}>{r.titulo}</p>
              <div style={{ display: 'flex', gap: '15px', fontSize: '0.78rem' }}>
                <span style={{ color: nivelColor[r.nivel] }}>● {r.nivel}</span>
                <span style={{ color: '#555' }}>/{r.categoria}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Perfil;