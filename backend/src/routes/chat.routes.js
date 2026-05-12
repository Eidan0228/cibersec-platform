const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/chat.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

router.post('/', verificarToken, chat);

module.exports = router;