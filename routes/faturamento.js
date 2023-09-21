const express = require("express");
const router = express.Router();

const {
        home,
        condPag,
        gruposDeVenda,
        clientes,
        atualizarSA1,
        detalhes,
        pedidosDeVenda,
        atualizarSC5,
        pedidosDeVendaDetalhes
    } = require('../controller/faturamento.js');

router.get("/", home);

router.get("/condicao-de-pagamento", condPag);

router.get("/grupos-de-venda", gruposDeVenda);

router.get("/clientes", clientes);
router.get("/atualizarSA1", atualizarSA1);
router.get("/clientes/detalhes/:id", detalhes);

router.get("/pedidosdevenda", pedidosDeVenda);
router.get("/atualizarSC5", atualizarSC5);
router.get("/pedidosdevenda/detalhes/:id/:filial", pedidosDeVendaDetalhes);

module.exports = router;