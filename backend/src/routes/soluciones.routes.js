const express = require('express');
const router = express.Router();
const { enviarSolucion, listarSolucionesPorReto, listarSolucionesPorUsuario } = require('../controllers/soluciones.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

router.post('/', verificarToken, enviarSolucion);
router.get('/reto/:id', listarSolucionesPorReto);
router.get('/usuario/:id', listarSolucionesPorUsuario);

module.exports = router;