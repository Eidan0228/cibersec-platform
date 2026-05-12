const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const retosRoutes = require('./routes/retos.routes');
const solucionesRoutes = require('./routes/soluciones.routes');
const comentariosRoutes = require('./routes/comentarios.routes');
const evaluacionesRoutes = require('./routes/evaluaciones.routes');
const rankingRoutes = require('./routes/ranking.routes');
const chatRoutes = require('./routes/chat.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/retos', retosRoutes);
app.use('/soluciones', solucionesRoutes);
app.use('/comentarios', comentariosRoutes);
app.use('/evaluaciones', evaluacionesRoutes);
app.use('/ranking', rankingRoutes);
app.use('/chat', chatRoutes);

app.get('/', (req, res) => {
  res.json({ success: true, data: 'Servidor funcionando correctamente' });
});

module.exports = app;