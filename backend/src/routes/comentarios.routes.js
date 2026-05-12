const express = require('express');
const router = express.Router();
const { agregarComentario, listarComentarios } = require('../controllers/comentarios.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

router.post('/', verificarToken, agregarComentario);
router.get('/solucion/:id', listarComentarios);

module.exports = router;