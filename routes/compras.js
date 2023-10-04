const express = require("express");
const router = express.Router();

const {home, pedidosKorp} = require('../controller/compras.js');

router.get("/", home);
router.get("/korp/pedidos", pedidosKorp);

module.exports = router;