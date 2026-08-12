import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';

const nivelColor = {
  BASICO: '#00ff88',
  INTERMEDIO: '#ffaa00',
  AVANZADO: '#ff4444'
};

const Retos = () => {
  const [retos, setRetos] = useState([]);
  const [error, setError] = useState('');
  const [filtroNivel, setFiltroNivel] = useState('TODOS');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const { usuario } = useAuth();
  const { t } = useLang();

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

  const categorias = [...new Set(retos.map(r => r.categoria))];

  const retosFiltrados = retos.filter(r => {
    const coincideNivel = filtroNivel === 'TODOS' || r.nivel === filtroNivel;
    const coincideCategoria = filtroCategoria === '' || r.categoria === filtroCategoria;
    const coincideBusqueda = busqueda === '' ||
      r.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    return coincideNivel && coincideCategoria && coincideBusqueda;
  });

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--accent)', fontSize: '1.4rem', letterSpacing: '2px' }}>{t('retosDisponibles')}</h2>
        {usuario && (
          <Link to="/retos/crear">
            <button style={{ padding: '8px 18px', fontSize: '0.85rem' }}>{t('nuevoReto')}</button>
          </Link>
        )}
      </div>

      <input
        type="text"
        placeholder={t('buscar')}
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ marginBottom: '15px' }}
      />

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
        {['TODOS', 'BASICO', 'INTERMEDIO', 'AVANZADO'].map(nivel => (
          <button key={nivel} onClick={() => setFiltroNivel(nivel)} style={{
            padding: '6px 14px',
            fontSize: '0.75rem',
            backgroundColor: filtroNivel === nivel ? 'var(--accent)' : 'transparent',
            color: filtroNivel === nivel ? '#0a0a0f' : 'var(--accent)',
            border: '1px solid var(--accent)'
          }}>
            {nivel === 'TODOS' ? t('todos').toUpperCase() : nivel}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={() => setFiltroCategoria('')} style={{
          padding: '5px 12px',
          fontSize: '0.75rem',
          backgroundColor: filtroCategoria === '' ? 'var(--accent)' : 'transparent',
          color: filtroCategoria === '' ? '#0a0a0f' : 'var(--accent)',
          border: '1px solid var(--accent)'
        }}>
          {t('todos').toUpperCase()}
        </button>
        {categorias.map(cat => (
          <button key={cat} onClick={() => setFiltroCategoria(cat)} style={{
            padding: '5px 12px',
            fontSize: '0.75rem',
            backgroundColor: filtroCategoria === cat ? 'var(--accent)' : 'transparent',
            color: filtroCategoria === cat ? '#0a0a0f' : 'var(--accent)',
            border: '1px solid var(--accent)'
          }}>
            {cat}
          </button>
        ))}
      </div>

      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
      {retosFiltrados.length === 0 && <p style={{ color: 'var(--text-muted)' }}>{t('noRetos')}</p>}

      <div style={{ display: 'grid', gap: '15px' }}>
        {retosFiltrados.map((reto) => (
          <div key={reto.id_reto} style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderLeft: `4px solid ${nivelColor[reto.nivel]}`,
            borderRadius: '6px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>{reto.titulo}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '12px' }}>{reto.descripcion}</p>
                <div style={{ display: 'flex', gap: '15px', fontSize: '0.78rem' }}>
                  <span style={{ color: nivelColor[reto.nivel] }}>● {reto.nivel}</span>
                  <span style={{ color: 'var(--text-muted)' }}>/{reto.categoria}</span>
                  <span style={{ color: 'var(--text-muted)' }}>by {reto.creador.nombre}</span>
                </div>
              </div>
              <Link to={`/retos/${reto.id_reto}`}>
                <button style={{ padding: '8px 16px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                  {t('ver')}
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