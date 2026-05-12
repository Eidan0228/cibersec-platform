const express = require('express');
const router = express.Router();
const { crearReto, listarRetos, verReto, editarReto, eliminarReto } = require('../controllers/retos.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

router.get('/', listarRetos);
router.get('/:id', verReto);
router.post('/', verificarToken, crearReto);
router.put('/:id', verificarToken, editarReto);
router.delete('/:id', verificarToken, eliminarReto);

module.exports = router;