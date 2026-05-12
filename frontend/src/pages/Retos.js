import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Retos = () => {
  const [retos, setRetos] = useState([]);
  const [error, setError] = useState('');
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

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Retos</h2>
        {usuario && <Link to="/retos/crear"><button>Crear Reto</button></Link>}
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {retos.length === 0 && <p>No hay retos disponibles.</p>}
      {retos.map((reto) => (
        <div key={reto.id_reto} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
          <h3>{reto.titulo}</h3>
          <p>{reto.descripcion}</p>
          <p><strong>Nivel:</strong> {reto.nivel} | <strong>Categoría:</strong> {reto.categoria}</p>
          <p><strong>Creador:</strong> {reto.creador.nombre}</p>
          <Link to={`/retos/${reto.id_reto}`}><button>Ver detalle</button></Link>
        </div>
      ))}
    </div>
  );
};

export default Retos;