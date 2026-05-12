import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Ranking = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');

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
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h2>Ranking de Usuarios</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {usuarios.map((usuario, index) => (
        <div key={usuario.id_usuario} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between' }}>
          <span><strong>#{index + 1}</strong> {usuario.nombre}</span>
          <span><strong>{usuario.puntos_totales}</strong> pts</span>
        </div>
      ))}
    </div>
  );
};

export default Ranking;