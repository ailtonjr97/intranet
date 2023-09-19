const express = require("express");
const router = express.Router();

const {home, condPag, gruposDeVenda, clientes, atualizarSA1, detalhes} = require('../controller/faturamento.js');

router.get("/", home);
router.get("/condicao-de-pagamento", condPag);
router.get("/grupos-de-venda", gruposDeVenda);
router.get("/clientes", clientes);
router.get("/atualizarSA1", atualizarSA1);
router.get("clientes/detalhes/:id", detalhes);

module.exports = router;