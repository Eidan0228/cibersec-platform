const express = require('express');
const router = express.Router();
const { evaluarSolucion } = require('../controllers/evaluaciones.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

router.post('/', verificarToken, evaluarSolucion);

module.exports = router;