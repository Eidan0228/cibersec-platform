import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CrearReto = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [nivel, setNivel] = useState('BASICO');
  const [categoria, setCategoria] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/retos', { titulo, descripcion, nivel, categoria });
      navigate('/retos');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el reto');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h2>Crear Reto</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <textarea
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            style={{ width: '100%', height: '100px', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <select
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="BASICO">Básico</option>
            <option value="INTERMEDIO">Intermedio</option>
            <option value="AVANZADO">Avanzado</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Categoría"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px' }}>
          Crear Reto
        </button>
      </form>
    </div>
  );
};

export default CrearReto;