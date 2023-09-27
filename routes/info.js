const express = require("express");
const router = express.Router();

const {info, empresas, filiais, modulos} = require('../controller/info.js');

router.get("/", info);

router.get("/empresas", empresas);
router.get("/filiais", filiais);
router.get("/modulos", modulos);

module.exports = router;