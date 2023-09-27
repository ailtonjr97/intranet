const express = require("express");
const router = express.Router();

const {info, empresas, filiais, modulos, parametros, insertVPC} = require('../controller/info.js');

router.get("/", info);

router.get("/empresas", empresas);

router.get("/filiais", filiais);

router.get("/modulos", modulos);

router.get("/parametros", parametros);
router.get("/parametros/atualizarVPC", insertVPC);

module.exports = router;