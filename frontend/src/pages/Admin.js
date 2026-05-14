import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [soluciones, setSoluciones] = useState([]);
  const [vista, setVista] = useState('usuarios');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (!usuario || usuario.rol !== 'ADMIN') {
      navigate('/retos');
      return;
    }
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [u, s] = await Promise.all([
        api.get('/admin/usuarios'),
        api.get('/admin/soluciones')
      ]);
      setUsuarios(u.data.data);
      setSoluciones(s.data.data);
    } catch (err) {
      setError('Error al cargar datos');
    }
  };

  const eliminarUsuario = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      await api.delete(`/admin/usuarios/${id}`);
      setMensaje('✓ Usuario eliminado');
      cargarDatos();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await api.put(`/admin/soluciones/${id}/estado`, { estado });
      setMensaje(`✓ Estado cambiado a ${estado}`);
      cargarDatos();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar estado');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px' }}>
      <h2 style={{ color: '#ff4444', fontSize: '1.4rem', letterSpacing: '2px', marginBottom: '5px' }}>
        &gt; PANEL DE ADMINISTRACIÓN
      </h2>
      <p style={{ color: '#555', fontSize: '0.8rem', marginBottom: '25px' }}>
        Acceso restringido · Solo administradores
      </p>

      {error && (
        <div style={{ backgroundColor: '#1a0000', border: '1px solid #ff4444', color: '#ff4444', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '0.85rem' }}>
          ⚠ {error}
        </div>
      )}
      {mensaje && (
        <div style={{ backgroundColor: '#001a0d', border: '1px solid #00ff88', color: '#00ff88', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '0.85rem' }}>
          {mensaje}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <button
          onClick={() => setVista('usuarios')}
          style={{
            padding: '8px 18px',
            fontSize: '0.85rem',
            backgroundColor: vista === 'usuarios' ? '#ff4444' : 'transparent',
            color: vista === 'usuarios' ? 'white' : '#ff4444',
            border: '1px solid #ff4444'
          }}
        >
          USUARIOS ({usuarios.length})
        </button>
        <button
          onClick={() => setVista('soluciones')}
          style={{
            padding: '8px 18px',
            fontSize: '0.85rem',
            backgroundColor: vista === 'soluciones' ? '#ff4444' : 'transparent',
            color: vista === 'soluciones' ? 'white' : '#ff4444',
            border: '1px solid #ff4444'
          }}
        >
          SOLUCIONES ({soluciones.length})
        </button>
      </div>

      {vista === 'usuarios' && (
        <div style={{ display: 'grid', gap: '10px' }}>
          {usuarios.map(u => (
            <div key={u.id_usuario} style={{
              backgroundColor: '#0d0d1a',
              border: '1px solid #1a1a3e',
              borderRadius: '6px',
              padding: '15px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <p style={{ color: '#e0e0e0', fontWeight: 'bold' }}>
                  {u.nombre}
                  {u.rol === 'ADMIN' && (
                    <span style={{ color: '#ff4444', fontSize: '0.75rem', marginLeft: '10px' }}>[ADMIN]</span>
                  )}
                </p>
                <p style={{ color: '#555', fontSize: '0.78rem' }}>{u.correo}</p>
                <p style={{ color: '#555', fontSize: '0.75rem' }}>
                  {u._count.retos_creados} retos · {u._count.soluciones} soluciones · {u.puntos_totales} pts
                </p>
              </div>
              {u.rol !== 'ADMIN' && (
                <button
                  onClick={() => eliminarUsuario(u.id_usuario)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#ff4444',
                    border: '1px solid #ff4444',
                    padding: '6px 14px',
                    fontSize: '0.8rem'
                  }}
                >
                  ELIMINAR
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {vista === 'soluciones' && (
        <div style={{ display: 'grid', gap: '10px' }}>
          {soluciones.map(s => (
            <div key={s.id_solucion} style={{
              backgroundColor: '#0d0d1a',
              border: '1px solid #1a1a3e',
              borderRadius: '6px',
              padding: '15px 20px'
            }}>
              <p style={{ color: '#e0e0e0', marginBottom: '5px' }}>{s.contenido_respuesta}</p>
              <p style={{ color: '#555', fontSize: '0.78rem', marginBottom: '10px' }}>
                by {s.usuario.nombre} · reto: {s.reto.titulo}
              </p>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{
                  color: s.estado === 'APROBADO' ? '#00ff88' : s.estado === 'RECHAZADO' ? '#ff4444' : '#ffaa00',
                  fontSize: '0.8rem'
                }}>
                  ● {s.estado}
                </span>
                {['PENDIENTE', 'APROBADO', 'RECHAZADO'].map(estado => (
                  <button
                    key={estado}
                    onClick={() => cambiarEstado(s.id_solucion, estado)}
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.75rem',
                      backgroundColor: s.estado === estado ? '#1a1a3e' : 'transparent',
                      color: '#e0e0e0',
                      border: '1px solid #1a1a3e'
                    }}
                  >
                    {estado}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;