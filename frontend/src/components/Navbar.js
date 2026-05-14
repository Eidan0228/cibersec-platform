import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      backgroundColor: '#0d0d1a',
      borderBottom: '1px solid #00ff88',
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link to="/retos" style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#00ff88', letterSpacing: '2px' }}>
        &gt; CIBERSEC_PLATFORM
      </Link>

      <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
        <Link to="/retos" style={{ color: '#e0e0e0', fontSize: '0.9rem', letterSpacing: '1px' }}>RETOS</Link>
        <Link to="/ranking" style={{ color: '#e0e0e0', fontSize: '0.9rem', letterSpacing: '1px' }}>RANKING</Link>
        {usuario && (
          <Link to="/chat" style={{ color: '#e0e0e0', fontSize: '0.9rem', letterSpacing: '1px' }}>CHATBOT</Link>
        )}
        {usuario && usuario.rol === 'ADMIN' && (
          <Link to="/admin" style={{ color: '#ff4444', fontSize: '0.9rem', letterSpacing: '1px', fontWeight: 'bold' }}>ADMIN</Link>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {usuario ? (
          <>
            <span style={{ color: '#00ff88', fontSize: '0.85rem' }}>[ {usuario.nombre} ]</span>
            <button onClick={handleLogout} style={{
              backgroundColor: 'transparent',
              color: '#ff4444',
              border: '1px solid #ff4444',
              padding: '6px 14px',
              fontSize: '0.8rem'
            }}>
              SALIR
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#e0e0e0', fontSize: '0.9rem' }}>LOGIN</Link>
            <Link to="/register">
              <button style={{ padding: '6px 14px', fontSize: '0.8rem' }}>REGISTRO</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;