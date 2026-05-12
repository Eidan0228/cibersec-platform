import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Retos from './pages/Retos';
import RetoDetalle from './pages/RetoDetalle';
import CrearReto from './pages/CrearReto';
import Ranking from './pages/Ranking';
import Chat from './pages/Chat';
import { useAuth } from './context/AuthContext';

const RutaProtegida = ({ children }) => {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/retos" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/retos" element={<Retos />} />
        <Route path="/retos/:id" element={<RetoDetalle />} />
        <Route path="/retos/crear" element={<RutaProtegida><CrearReto /></RutaProtegida>} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/chat" element={<RutaProtegida><Chat /></RutaProtegida>} />
      </Routes>
    </Router>
  );
}

export default App;