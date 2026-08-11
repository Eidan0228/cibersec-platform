const express = require('express');
const router = express.Router();
const { obtenerUsuarios, eliminarUsuario, cambiarEstadoSolucion, obtenerTodasSoluciones, obtenerTodosRetos, editarRetoAdmin } = require('../controllers/admin.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const { esAdmin } = require('../middlewares/admin.middleware');

router.get('/usuarios', verificarToken, esAdmin, obtenerUsuarios);
router.delete('/usuarios/:id', verificarToken, esAdmin, eliminarUsuario);
router.get('/soluciones', verificarToken, esAdmin, obtenerTodasSoluciones);
router.put('/soluciones/:id/estado', verificarToken, esAdmin, cambiarEstadoSolucion);
router.get('/retos', verificarToken, esAdmin, obtenerTodosRetos);
router.put('/retos/:id', verificarToken, esAdmin, editarRetoAdmin);

module.exports = router;