import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const nivelColor = {
  BASICO: '#00ff88',
  INTERMEDIO: '#ffaa00',
  AVANZADO: '#ff4444'
};

const Retos = () => {
  const [retos, setRetos] = useState([]);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('TODOS');
  const { usuario } = useAuth();

  useEffect(() => {
    const fetchRetos = async () => {
      try {
        const res = await api.get('/retos');
        setRetos(res.data.data);
      } catch (err) {
        setError('Error al cargar los retos');
      }
    };
    fetchRetos();
  }, []);

  const retosFiltrados = filtro === 'TODOS' ? retos : retos.filter(r => r.nivel === filtro);

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#00ff88', fontSize: '1.4rem', letterSpacing: '2px' }}>&gt; RETOS DISPONIBLES</h2>
        {usuario && (
          <Link to="/retos/crear">
            <button style={{ padding: '8px 18px', fontSize: '0.85rem' }}>+ NUEVO RETO</button>
          </Link>
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        {['TODOS', 'BASICO', 'INTERMEDIO', 'AVANZADO'].map(nivel => (
          <button
            key={nivel}
            onClick={() => setFiltro(nivel)}
            style={{
              padding: '6px 14px',
              fontSize: '0.75rem',
              backgroundColor: filtro === nivel ? '#00ff88' : 'transparent',
              color: filtro === nivel ? '#0a0a0f' : '#00ff88',
              border: '1px solid #00ff88'
            }}
          >
            {nivel}
          </button>
        ))}
      </div>

      {error && <p style={{ color: '#ff4444' }}>{error}</p>}
      {retosFiltrados.length === 0 && <p style={{ color: '#555' }}>No hay retos disponibles.</p>}

      <div style={{ display: 'grid', gap: '15px' }}>
        {retosFiltrados.map((reto) => (
          <div key={reto.id_reto} style={{
            backgroundColor: '#0d0d1a',
            border: '1px solid #1a1a3e',
            borderLeft: `4px solid ${nivelColor[reto.nivel]}`,
            borderRadius: '6px',
            padding: '20px',
            transition: 'border-color 0.2s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ color: '#e0e0e0', marginBottom: '8px' }}>{reto.titulo}</h3>
                <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '12px' }}>{reto.descripcion}</p>
                <div style={{ display: 'flex', gap: '15px', fontSize: '0.78rem' }}>
                  <span style={{ color: nivelColor[reto.nivel] }}>● {reto.nivel}</span>
                  <span style={{ color: '#555' }}>/{reto.categoria}</span>
                  <span style={{ color: '#555' }}>by {reto.creador.nombre}</span>
                </div>
              </div>
              <Link to={`/retos/${reto.id_reto}`}>
                <button style={{ padding: '8px 16px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  VER →
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Retos;