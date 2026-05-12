import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ backgroundColor: '#1a1a2e', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/retos" style={{ color: 'white', textDecoration: 'none' }}>Retos</Link>
        <Link to="/ranking" style={{ color: 'white', textDecoration: 'none' }}>Ranking</Link>
        {usuario && <Link to="/chat" style={{ color: 'white', textDecoration: 'none' }}>Chatbot</Link>}
      </div>
      <div>
        {usuario ? (
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{ color: 'white' }}>Hola, {usuario.nombre}</span>
            <button onClick={handleLogout} style={{ padding: '5px 15px' }}>Cerrar sesión</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Registro</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
