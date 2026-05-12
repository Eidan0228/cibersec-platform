import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const RetoDetalle = () => {
  const { id } = useParams();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [reto, setReto] = useState(null);
  const [soluciones, setSoluciones] = useState([]);
  const [respuesta, setRespuesta] = useState('');
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const fetchReto = async () => {
      try {
        const res = await api.get(`/retos/${id}`);
        setReto(res.data.data);
        const sol = await api.get(`/soluciones/reto/${id}`);
        setSoluciones(sol.data.data);
      } catch (err) {
        setError('Error al cargar el reto');
      }
    };
    fetchReto();
  }, [id]);

  const enviarSolucion = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    try {
      await api.post('/soluciones', { contenido_respuesta: respuesta, id_reto: parseInt(id) });
      setMensaje('Solución enviada correctamente');
      setRespuesta('');
      const sol = await api.get(`/soluciones/reto/${id}`);
      setSoluciones(sol.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar solución');
    }
  };

  const eliminarReto = async () => {
    try {
      await api.delete(`/retos/${id}`);
      navigate('/retos');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar reto');
    }
  };

  if (!reto) return <p style={{ textAlign: 'center', marginTop: '40px' }}>Cargando...</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h2>{reto.titulo}</h2>
      <p>{reto.descripcion}</p>
      <p><strong>Nivel:</strong> {reto.nivel} | <strong>Categoría:</strong> {reto.categoria}</p>
      <p><strong>Creador:</strong> {reto.creador.nombre}</p>

      {usuario && (reto.id_creador === usuario.id_usuario || usuario.rol === 'ADMIN') && (
        <button onClick={eliminarReto} style={{ backgroundColor: 'red', color: 'white', marginBottom: '20px' }}>
          Eliminar Reto
        </button>
      )}

      {usuario && (
        <div style={{ marginTop: '20px' }}>
          <h3>Enviar Solución</h3>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
          <form onSubmit={enviarSolucion}>
            <textarea
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              placeholder="Escribe tu solución aquí..."
              style={{ width: '100%', height: '100px', padding: '8px' }}
            />
            <button type="submit" style={{ marginTop: '10px', padding: '10px' }}>Enviar</button>
          </form>
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <h3>Soluciones ({soluciones.length})</h3>
        {soluciones.length === 0 && <p>No hay soluciones aún.</p>}
        {soluciones.map((sol) => (
          <div key={sol.id_solucion} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
            <p>{sol.contenido_respuesta}</p>
            <p><strong>Por:</strong> {sol.usuario.nombre} | <strong>Estado:</strong> {sol.estado} | <strong>Puntaje:</strong> {sol.puntaje_obtenido}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RetoDetalle;