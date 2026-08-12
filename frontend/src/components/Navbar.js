import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLang } from '../context/LangContext';

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const { oscuro, toggleTema } = useTheme();
  const { idioma, toggleIdioma, t } = useLang();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{
      backgroundColor: 'var(--nav-bg)',
      borderBottom: '1px solid var(--accent)',
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      flexWrap: 'wrap',
      gap: '10px'
    }}>
      <Link to="/retos" style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--accent)', letterSpacing: '2px' }}>
        &gt; CIBERSEC
      </Link>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/retos" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{t('retos').toUpperCase()}</Link>
        <Link to="/ranking" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{t('ranking').toUpperCase()}</Link>
        {usuario && <Link to="/chat" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{t('chatbot').toUpperCase()}</Link>}
        {usuario && usuario.rol === 'ADMIN' && (
          <Link to="/admin" style={{ color: 'var(--danger)', fontSize: '0.9rem', fontWeight: 'bold' }}>{t('admin').toUpperCase()}</Link>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <button onClick={toggleIdioma} style={{
          backgroundColor: 'transparent',
          color: 'var(--accent)',
          border: '1px solid var(--accent)',
          padding: '4px 10px',
          fontSize: '0.8rem'
        }}>
          {idioma === 'es' ? 'EN' : 'ES'}
        </button>

        <button onClick={toggleTema} style={{
          backgroundColor: 'transparent',
          color: 'var(--accent)',
          border: '1px solid var(--accent)',
          padding: '4px 10px',
          fontSize: '0.8rem'
        }}>
          {oscuro ? '☀' : '🌙'}
        </button>

        {usuario ? (
          <>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Link to="/perfil" style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>[ {usuario.nombre} ]</Link>
              <Link to="/cambiar-contrasena" style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>⚙</Link>
            </div>
            <button onClick={handleLogout} style={{
              backgroundColor: 'transparent',
              color: 'var(--danger)',
              border: '1px solid var(--danger)',
              padding: '6px 14px',
              fontSize: '0.8rem'
            }}>
              {t('salir').toUpperCase()}
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{t('login').toUpperCase()}</Link>
            <Link to="/register">
              <button style={{ padding: '6px 14px', fontSize: '0.8rem' }}>{t('registro').toUpperCase()}</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;