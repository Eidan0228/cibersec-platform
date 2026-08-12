import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [soluciones, setSoluciones] = useState([]);
  const [retos, setRetos] = useState([]);
  const [vista, setVista] = useState('usuarios');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [retoEditando, setRetoEditando] = useState(null);
  const [formReto, setFormReto] = useState({});
  const [metricas, setMetricas] = useState(null);

  useEffect(() => {
    if (!usuario || usuario.rol !== 'ADMIN') {
      navigate('/retos');
      return;
    }
    cargarDatos();
  }, []);

 const cargarDatos = async () => {
  try {
    const [u, s, r, m] = await Promise.all([
      api.get('/admin/usuarios'),
      api.get('/admin/soluciones'),
      api.get('/admin/retos'),
      api.get('/admin/metricas')
    ]);
    setUsuarios(u.data.data);
    setSoluciones(s.data.data);
    setRetos(r.data.data);
    setMetricas(m.data.data);
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

  const iniciarEdicionReto = (reto) => {
    setRetoEditando(reto.id_reto);
    setFormReto({ titulo: reto.titulo, descripcion: reto.descripcion, nivel: reto.nivel, categoria: reto.categoria });
  };

  const guardarReto = async (id) => {
    try {
      await api.put(`/admin/retos/${id}`, formReto);
      setMensaje('✓ Reto actualizado');
      setRetoEditando(null);
      cargarDatos();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al editar reto');
    }
  };

  const eliminarReto = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este reto?')) return;
    try {
      await api.delete(`/retos/${id}`);
      setMensaje('✓ Reto eliminado');
      cargarDatos();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar reto');
    }
  };

  const btnStyle = (activo) => ({
    padding: '8px 18px',
    fontSize: '0.85rem',
    backgroundColor: activo ? '#ff4444' : 'transparent',
    color: activo ? 'white' : '#ff4444',
    border: '1px solid #ff4444'
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px' }}>
      <h2 style={{ color: '#ff4444', fontSize: '1.4rem', letterSpacing: '2px', marginBottom: '5px' }}>
        &gt; PANEL DE ADMINISTRACIÓN
      </h2>
      <p style={{ color: '#555', fontSize: '0.8rem', marginBottom: '25px' }}>
        Acceso restringido · Solo administradores
      </p>

      {error && <div style={{ backgroundColor: '#1a0000', border: '1px solid #ff4444', color: '#ff4444', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '0.85rem' }}>⚠ {error}</div>}
      {mensaje && <div style={{ backgroundColor: '#001a0d', border: '1px solid #00ff88', color: '#00ff88', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '0.85rem' }}>{mensaje}</div>}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <button onClick={() => setVista('usuarios')} style={btnStyle(vista === 'usuarios')}>USUARIOS ({usuarios.length})</button>
        <button onClick={() => setVista('soluciones')} style={btnStyle(vista === 'soluciones')}>SOLUCIONES ({soluciones.length})</button>
        <button onClick={() => setVista('retos')} style={btnStyle(vista === 'retos')}>RETOS ({retos.length})</button>
        <button onClick={() => setVista('metricas')} style={btnStyle(vista === 'metricas')}>MÉTRICAS</button>
      </div>

      {vista === 'usuarios' && (
        <div style={{ display: 'grid', gap: '10px' }}>
          {usuarios.map(u => (
            <div key={u.id_usuario} style={{ backgroundColor: '#0d0d1a', border: '1px solid #1a1a3e', borderRadius: '6px', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#e0e0e0', fontWeight: 'bold' }}>
                  {u.nombre}
                  {u.rol === 'ADMIN' && <span style={{ color: '#ff4444', fontSize: '0.75rem', marginLeft: '10px' }}>[ADMIN]</span>}
                </p>
                <p style={{ color: '#555', fontSize: '0.78rem' }}>{u.correo}</p>
                <p style={{ color: '#555', fontSize: '0.75rem' }}>{u._count.retos_creados} retos · {u._count.soluciones} soluciones · {u.puntos_totales} pts</p>
              </div>
              {u.rol !== 'ADMIN' && (
                <button onClick={() => eliminarUsuario(u.id_usuario)} style={{ backgroundColor: 'transparent', color: '#ff4444', border: '1px solid #ff4444', padding: '6px 14px', fontSize: '0.8rem' }}>
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
            <div key={s.id_solucion} style={{ backgroundColor: '#0d0d1a', border: '1px solid #1a1a3e', borderRadius: '6px', padding: '15px 20px' }}>
              <p style={{ color: '#e0e0e0', marginBottom: '5px' }}>{s.contenido_respuesta}</p>
              <p style={{ color: '#555', fontSize: '0.78rem', marginBottom: '10px' }}>by {s.usuario.nombre} · reto: {s.reto.titulo}</p>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ color: s.estado === 'APROBADO' ? '#00ff88' : s.estado === 'RECHAZADO' ? '#ff4444' : '#ffaa00', fontSize: '0.8rem' }}>● {s.estado}</span>
                {['PENDIENTE', 'APROBADO', 'RECHAZADO'].map(estado => (
                  <button key={estado} onClick={() => cambiarEstado(s.id_solucion, estado)} style={{ padding: '4px 10px', fontSize: '0.75rem', backgroundColor: s.estado === estado ? '#1a1a3e' : 'transparent', color: '#e0e0e0', border: '1px solid #1a1a3e' }}>
                    {estado}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {vista === 'retos' && (
        <div style={{ display: 'grid', gap: '10px' }}>
          {retos.map(r => (
            <div key={r.id_reto} style={{ backgroundColor: '#0d0d1a', border: '1px solid #1a1a3e', borderRadius: '6px', padding: '15px 20px' }}>
              {retoEditando === r.id_reto ? (
                <div>
                  <input value={formReto.titulo} onChange={e => setFormReto({ ...formReto, titulo: e.target.value })} placeholder="Título" style={{ marginBottom: '8px' }} />
                  <textarea value={formReto.descripcion} onChange={e => setFormReto({ ...formReto, descripcion: e.target.value })} placeholder="Descripción" style={{ height: '80px', marginBottom: '8px' }} />
                  <select value={formReto.nivel} onChange={e => setFormReto({ ...formReto, nivel: e.target.value })} style={{ marginBottom: '8px' }}>
                    <option value="BASICO">Básico</option>
                    <option value="INTERMEDIO">Intermedio</option>
                    <option value="AVANZADO">Avanzado</option>
                  </select>
                  <input value={formReto.categoria} onChange={e => setFormReto({ ...formReto, categoria: e.target.value })} placeholder="Categoría" style={{ marginBottom: '8px' }} />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => guardarReto(r.id_reto)} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>GUARDAR</button>
                    <button onClick={() => setRetoEditando(null)} style={{ backgroundColor: 'transparent', color: '#555', border: '1px solid #555', padding: '6px 14px', fontSize: '0.8rem' }}>CANCELAR</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ color: '#e0e0e0', fontWeight: 'bold' }}>{r.titulo}</p>
                    <p style={{ color: '#555', fontSize: '0.78rem' }}>{r.nivel} · {r.categoria} · by {r.creador.nombre}</p>
                    <p style={{ color: '#555', fontSize: '0.75rem' }}>{r._count.soluciones} soluciones</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => iniciarEdicionReto(r)} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>EDITAR</button>
                    <button onClick={() => eliminarReto(r.id_reto)} style={{ backgroundColor: 'transparent', color: '#ff4444', border: '1px solid #ff4444', padding: '6px 14px', fontSize: '0.8rem' }}>ELIMINAR</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {vista === 'metricas' && metricas && (
  <div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '25px' }}>
      {[
        { label: 'USUARIOS', valor: metricas.totalUsuarios },
        { label: 'RETOS', valor: metricas.totalRetos },
        { label: 'SOLUCIONES', valor: metricas.totalSoluciones },
        { label: 'COMENTARIOS', valor: metricas.totalComentarios },
        { label: 'EVALUACIONES', valor: metricas.totalEvaluaciones }
      ].map(stat => (
        <div key={stat.label} style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--accent)', borderRadius: '6px', padding: '20px', textAlign: 'center' }}>
          <p style={{ color: 'var(--accent)', fontSize: '2rem', fontWeight: 'bold' }}>{stat.valor}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{stat.label}</p>
        </div>
      ))}
    </div>

    <h3 style={{ color: 'var(--accent)', marginBottom: '15px', fontSize: '1rem' }}>&gt; TOP 3 USUARIOS</h3>
    <div style={{ display: 'grid', gap: '10px', marginBottom: '25px' }}>
      {metricas.topUsuarios.map((u, i) => (
        <div key={i} style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '15px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-primary)' }}>#{i + 1} {u.nombre}</span>
          <span style={{ color: 'var(--accent)' }}>{u.puntos_totales} pts</span>
        </div>
      ))}
    </div>

    <h3 style={{ color: 'var(--accent)', marginBottom: '15px', fontSize: '1rem' }}>&gt; SOLUCIONES POR ESTADO</h3>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
      {metricas.solucionesPorEstado.map(s => (
        <div key={s.estado} style={{ backgroundColor: 'var(--bg-secondary)', border: `1px solid ${s.estado === 'APROBADO' ? 'var(--accent)' : s.estado === 'RECHAZADO' ? 'var(--danger)' : 'var(--warning)'}`, borderRadius: '6px', padding: '15px', textAlign: 'center' }}>
          <p style={{ color: s.estado === 'APROBADO' ? 'var(--accent)' : s.estado === 'RECHAZADO' ? 'var(--danger)' : 'var(--warning)', fontSize: '1.5rem', fontWeight: 'bold' }}>{s._count.estado}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{s.estado}</p>
        </div>
      ))}
    </div>
  </div>
)}
    </div>
  );
};

export default Admin;