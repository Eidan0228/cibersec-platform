const express = require('express');
const router = express.Router();
const { enviarSolucion, listarSolucionesPorReto, listarSolucionesPorUsuario, editarSolucion } = require('../controllers/soluciones.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

router.post('/', verificarToken, enviarSolucion);
router.get('/reto/:id', listarSolucionesPorReto);
router.get('/usuario/:id', listarSolucionesPorUsuario);
router.put('/:id', verificarToken, editarSolucion);

module.exports = router;