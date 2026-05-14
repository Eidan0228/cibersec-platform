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
    <div style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        backgroundColor: '#0d0d1a',
        border: '1px solid #00ff88',
        borderRadius: '8px',
        padding: '40px',
        width: '100%',
        maxWidth: '550px',
        boxShadow: '0 0 30px rgba(0, 255, 136, 0.1)'
      }}>
        <h2 style={{ color: '#00ff88', marginBottom: '8px', fontSize: '1.4rem', letterSpacing: '2px' }}>
          &gt; CREAR RETO
        </h2>
        <p style={{ color: '#555', fontSize: '0.8rem', marginBottom: '30px' }}>
          Define un nuevo reto para la comunidad
        </p>

        {error && (
          <div style={{
            backgroundColor: '#1a0000',
            border: '1px solid #ff4444',
            color: '#ff4444',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '0.85rem'
          }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: '0.75rem', color: '#00ff88', letterSpacing: '1px' }}>TÍTULO</label>
          <input
            type="text"
            placeholder="Nombre del reto"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <label style={{ fontSize: '0.75rem', color: '#00ff88', letterSpacing: '1px' }}>DESCRIPCIÓN</label>
          <textarea
            placeholder="Describe el reto detalladamente..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            style={{ height: '120px', resize: 'vertical' }}
          />

          <label style={{ fontSize: '0.75rem', color: '#00ff88', letterSpacing: '1px' }}>NIVEL</label>
          <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
            <option value="BASICO">Básico</option>
            <option value="INTERMEDIO">Intermedio</option>
            <option value="AVANZADO">Avanzado</option>
          </select>

          <label style={{ fontSize: '0.75rem', color: '#00ff88', letterSpacing: '1px' }}>CATEGORÍA</label>
          <input
            type="text"
            placeholder="Ej: Web Security, Redes, Criptografía..."
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />

          <button type="submit" style={{ width: '100%', padding: '12px', marginTop: '10px', fontSize: '0.95rem', letterSpacing: '1px' }}>
            CREAR RETO →
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearReto;