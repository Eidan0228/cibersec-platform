import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');
    try {
      await api.post('/auth/register', { nombre, correo, contrasena });
      setExito('Cuenta creada correctamente. Redirigiendo...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <div style={{
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
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
          &gt; CREAR CUENTA
        </h2>
        <p style={{ color: '#555', fontSize: '0.8rem', marginBottom: '30px' }}>
          Únete a la plataforma de retos
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

        {exito && (
          <div style={{
            backgroundColor: '#001a0d',
            border: '1px solid #00ff88',
            color: '#00ff88',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '0.85rem'
          }}>
            ✓ {exito}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: '0.75rem', color: '#00ff88', letterSpacing: '1px' }}>NOMBRE</label>
          <input
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <label style={{ fontSize: '0.75rem', color: '#00ff88', letterSpacing: '1px' }}>CORREO</label>
          <input
            type="email"
            placeholder="usuario@correo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <label style={{ fontSize: '0.75rem', color: '#00ff88', letterSpacing: '1px' }}>CONTRASEÑA</label>
          <input
            type="password"
            placeholder="••••••••"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
          <button type="submit" style={{ width: '100%', padding: '12px', marginTop: '10px', fontSize: '0.95rem', letterSpacing: '1px' }}>
            REGISTRARSE →
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#555' }}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;