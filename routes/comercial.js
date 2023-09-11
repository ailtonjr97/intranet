const express = require("express");
const router = express.Router();

const {home, gruposDeVenda} = require('../controller/comercial.js');

router.get("/", home);
router.get("/grupos-de-venda", gruposDeVenda);

module.exports = router;