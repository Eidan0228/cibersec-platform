const express = require('express');
const cors = require('cors');
require('dotenv').config();

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Demasiadas solicitudes, intenta en 15 minutos.' }
});

const authRoutes = require('./routes/auth.routes');
const retosRoutes = require('./routes/retos.routes');
const solucionesRoutes = require('./routes/soluciones.routes');
const comentariosRoutes = require('./routes/comentarios.routes');
const evaluacionesRoutes = require('./routes/evaluaciones.routes');
const rankingRoutes = require('./routes/ranking.routes');
const chatRoutes = require('./routes/chat.routes');
const adminRoutes = require('./routes/admin.routes');
const perfilRoutes = require('./routes/perfil.routes');
const archivosRoutes = require('./routes/archivos.routes');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

app.use(limiter);
app.use('/auth', authRoutes);
app.use('/retos', retosRoutes);
app.use('/soluciones', solucionesRoutes);
app.use('/comentarios', comentariosRoutes);
app.use('/evaluaciones', evaluacionesRoutes);
app.use('/ranking', rankingRoutes);
app.use('/chat', chatRoutes);
app.use('/admin', adminRoutes);
app.use('/perfil', perfilRoutes);
app.use('/archivos', archivosRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
  res.json({ success: true, data: 'Servidor funcionando correctamente' });
});

module.exports = app;