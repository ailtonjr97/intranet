const express = require("express");
const router = express.Router();

const {home, produtos, atualizarSB1} = require('../controller/logistica.js');

router.get("/", home);
router.get("/produtos", produtos);
router.get("/produtos/atualizarSB1", atualizarSB1)

module.exports = router;