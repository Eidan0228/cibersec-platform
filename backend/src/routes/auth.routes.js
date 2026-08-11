const express = require('express');
const router = express.Router();
const { register, login, cambiarContrasena } = require('../controllers/auth.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

router.post('/register', register);
router.post('/login', login);
router.put('/cambiar-contrasena', verificarToken, cambiarContrasena);

module.exports = router;