import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [oscuro, setOscuro] = useState(() => {
    return localStorage.getItem('tema') !== 'claro';
  });

  const toggleTema = () => {
    const nuevoTema = !oscuro;
    setOscuro(nuevoTema);
    localStorage.setItem('tema', nuevoTema ? 'oscuro' : 'claro');
  };

  return (
    <ThemeContext.Provider value={{ oscuro, toggleTema }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);