const express = require('express');
const router = express.Router();
const { obtenerRanking } = require('../controllers/ranking.controller');

router.get('/', obtenerRanking);

module.exports = router;