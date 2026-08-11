const express = require('express');
const router = express.Router();
const { obtenerPerfil } = require('../controllers/perfil.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

router.get('/', verificarToken, obtenerPerfil);

module.exports = router;