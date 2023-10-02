const express = require("express");
const router = express.Router();

const {
    home,
    produtos,
    atualizarSB1,
    detalhes,
    produtosKorp,
    produtosKorpDetalhes,
    itenskorptotvs
} = require('../controller/logistica.js');

router.get("/", home);
router.get("/produtos", produtos);
router.get("/produtos/atualizarSB1", atualizarSB1)
router.get("/produtos/detalhes/:id", detalhes)


///////KORP
router.get("/korp/produtos", produtosKorp);
router.get("/korp/produtos/:id", produtosKorpDetalhes);

///////KORP X TOTVS
router.get("/itenskorptotvs", itenskorptotvs);

module.exports = router;