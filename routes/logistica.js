const express = require("express");
const router = express.Router();

const {home, produtos, atualizarSB1, detalhes, sql} = require('../controller/logistica.js');

router.get("/", home);
router.get("/produtos", produtos);
router.get("/produtos/atualizarSB1", atualizarSB1)
router.get("/produtos/detalhes/:id", detalhes)
router.get("/produtos/sql", sql)

module.exports = router;