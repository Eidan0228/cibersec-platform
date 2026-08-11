import React, { useState } from 'react';
import api from '../services/api';

const CambiarContrasena = () => {
  const [contrasena_actual, setActual] = useState('');
  const [contrasena_nueva, setNueva] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');
    setCargando(true);
    try {
      await api.put('/auth/cambiar-contrasena', { contrasena_actual, contrasena_nueva });
      setExito('Contraseña actualizada correctamente');
      setActual('');
      setNueva('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar contraseña');
    } finally {
      setCargando(false);
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
        maxWidth: '420px',
        boxShadow: '0 0 30px rgba(0, 255, 136, 0.1)'
      }}>
        <h2 style={{ color: '#00ff88', marginBottom: '8px', fontSize: '1.4rem', letterSpacing: '2px' }}>
          &gt; CAMBIAR CONTRASEÑA
        </h2>
        <p style={{ color: '#555', fontSize: '0.8rem', marginBottom: '30px' }}>
          Ingresa tu contraseña actual y la nueva
        </p>

        {error && (
          <div style={{ backgroundColor: '#1a0000', border: '1px solid #ff4444', color: '#ff4444', padding: '10px', borderRadius: '4px', marginBottom: '20px', fontSize: '0.85rem' }}>
            ⚠ {error}
          </div>
        )}
        {exito && (
          <div style={{ backgroundColor: '#001a0d', border: '1px solid #00ff88', color: '#00ff88', padding: '10px', borderRadius: '4px', marginBottom: '20px', fontSize: '0.85rem' }}>
            ✓ {exito}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: '0.75rem', color: '#00ff88', letterSpacing: '1px' }}>CONTRASEÑA ACTUAL</label>
          <input
            type="password"
            placeholder="••••••••"
            value={contrasena_actual}
            onChange={(e) => setActual(e.target.value)}
          />
          <label style={{ fontSize: '0.75rem', color: '#00ff88', letterSpacing: '1px' }}>CONTRASEÑA NUEVA</label>
          <input
            type="password"
            placeholder="••••••••"
            value={contrasena_nueva}
            onChange={(e) => setNueva(e.target.value)}
          />
          <button type="submit" disabled={cargando} style={{ width: '100%', padding: '12px', marginTop: '10px', fontSize: '0.95rem', letterSpacing: '1px', opacity: cargando ? 0.5 : 1 }}>
            {cargando ? 'ACTUALIZANDO...' : 'CAMBIAR CONTRASEÑA →'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CambiarContrasena;