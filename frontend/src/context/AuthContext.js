import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    const token = localStorage.getItem('token');
    const nombre = localStorage.getItem('nombre');
    const rol = localStorage.getItem('rol');
    return token ? { token, nombre, rol } : null;
  });

  const login = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('nombre', data.nombre);
    localStorage.setItem('rol', data.rol);
    setUsuario(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    localStorage.removeItem('rol');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);