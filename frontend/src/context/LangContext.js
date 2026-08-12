import React, { createContext, useState, useContext } from 'react';

const LangContext = createContext();

const traducciones = {
  es: {
    retos: 'Retos',
    ranking: 'Ranking',
    chatbot: 'Chatbot',
    admin: 'Admin',
    salir: 'Salir',
    login: 'Login',
    registro: 'Registro',
    perfil: 'Perfil',
    buscar: 'Buscar retos...',
    todos: 'Todos',
    nivel: 'Nivel',
    categoria: 'Categoría',
    creador: 'Creador',
    ver: 'Ver →',
    nuevoReto: '+ Nuevo Reto',
    retosDisponibles: '> Retos Disponibles',
    noRetos: 'No hay retos disponibles.',
    verComentarios: 'Ver Comentarios',
    enviarSolucion: '> Enviar Solución',
    soluciones: '> Soluciones',
    evaluar: 'Evaluar',
    comentar: 'Comentar',
    editarSolucion: 'Editar Solución',
    guardar: 'Guardar',
    cancelar: 'Cancelar',
    eliminarReto: 'Eliminar Reto',
    rankingGlobal: '> Ranking Global',
    puntos: 'puntos',
    asistente: '> Asistente de Ciberseguridad',
    escribePregunta: 'Escribe tu pregunta sobre ciberseguridad...',
    enviar: 'Enviar →',
    procesando: 'procesando...',
  },
  en: {
    retos: 'Challenges',
    ranking: 'Ranking',
    chatbot: 'Chatbot',
    admin: 'Admin',
    salir: 'Logout',
    login: 'Login',
    registro: 'Register',
    perfil: 'Profile',
    buscar: 'Search challenges...',
    todos: 'All',
    nivel: 'Level',
    categoria: 'Category',
    creador: 'Creator',
    ver: 'View →',
    nuevoReto: '+ New Challenge',
    retosDisponibles: '> Available Challenges',
    noRetos: 'No challenges available.',
    verComentarios: 'View Comments',
    enviarSolucion: '> Submit Solution',
    soluciones: '> Solutions',
    evaluar: 'Evaluate',
    comentar: 'Comment',
    editarSolucion: 'Edit Solution',
    guardar: 'Save',
    cancelar: 'Cancel',
    eliminarReto: 'Delete Challenge',
    rankingGlobal: '> Global Ranking',
    puntos: 'points',
    asistente: '> Cybersecurity Assistant',
    escribePregunta: 'Ask your cybersecurity question...',
    enviar: 'Send →',
    procesando: 'processing...',
  }
};

export const LangProvider = ({ children }) => {
  const [idioma, setIdioma] = useState(() => {
    return localStorage.getItem('idioma') || 'es';
  });

  const toggleIdioma = () => {
    const nuevo = idioma === 'es' ? 'en' : 'es';
    setIdioma(nuevo);
    localStorage.setItem('idioma', nuevo);
  };

  const t = (clave) => traducciones[idioma][clave] || clave;

  return (
    <LangContext.Provider value={{ idioma, toggleIdioma, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);