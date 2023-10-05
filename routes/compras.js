const express = require("express");
const router = express.Router();

const {home, pedidosKorp, pedidosKorpDetalhes} = require('../controller/compras.js');

router.get("/", home);
router.get("/korp/pedidos", pedidosKorp);
router.get("/korp/pedidos/:id", pedidosKorpDetalhes);

module.exports = router;