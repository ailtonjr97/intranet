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
        pedidosDeVendaDetalhes,
        notasFicalSaida,
        atualizarSF2,
        notaFiscalSaidaDetalhes,
        atualizarSE4,
        atualizarACY,
        pedidosKorp,
        pedidosKorpDetalhes
    } = require('../controller/faturamento.js');

router.get("/", home);

router.get("/clientes", clientes);
router.get("/atualizarSA1", atualizarSA1);
router.get("/clientes/detalhes/:id", detalhes);

router.get("/condicao-de-pagamento", condPag);
router.get("/atualizarSE4", atualizarSE4)

router.get("/grupos-de-venda", gruposDeVenda);
router.get("/atualizarACY", atualizarACY);

router.get("/pedidosdevenda", pedidosDeVenda);
router.get("/atualizarSC5", atualizarSC5);
router.get("/pedidosdevenda/detalhes/:id/:filial", pedidosDeVendaDetalhes);

router.get("/nota-fiscal-saida", notasFicalSaida);
router.get("/atualizarSF2", atualizarSF2);
router.get("/nota-fiscal-saida/detalhes/:doc", notaFiscalSaidaDetalhes);

////////////KORP
router.get("/korp/pedidos", pedidosKorp);
router.get("/korp/pedidos/:ano/:id", pedidosKorpDetalhes);

module.exports = router;