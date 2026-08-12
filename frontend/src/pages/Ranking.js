import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useLang } from '../context/LangContext';

const medallaColor = ['#FFD700', '#C0C0C0', '#CD7F32'];

const Ranking = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const { t } = useLang();

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const res = await api.get('/ranking');
        setUsuarios(res.data.data);
      } catch (err) {
        setError('Error al cargar el ranking');
      }
    };
    fetchRanking();
  }, []);

  return (
    <div style={{ maxWidth: '700px', margin: '40px auto', padding: '20px' }}>
      <h2 style={{ color: 'var(--accent)', fontSize: '1.4rem', letterSpacing: '2px', marginBottom: '30px' }}>
        {t('rankingGlobal')}
      </h2>

      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}

      <div style={{ display: 'grid', gap: '10px' }}>
        {usuarios.map((usuario, index) => (
          <div key={usuario.id_usuario} style={{
            backgroundColor: 'var(--bg-secondary)',
            border: `1px solid ${index < 3 ? medallaColor[index] : 'var(--border-color)'}`,
            borderRadius: '6px',
            padding: '15px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: index < 3 ? '1.3rem' : '1rem', color: index < 3 ? medallaColor[index] : 'var(--text-muted)', minWidth: '30px', fontWeight: 'bold' }}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
              </span>
              <div>
                <p style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{usuario.nombre}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  {usuario._count.retos_creados} retos · {usuario._count.soluciones} soluciones
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.1rem' }}>{usuario.puntos_totales}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{t('puntos')}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ranking;