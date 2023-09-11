const express = require("express");
const router = express.Router();

const {home, condPag} = require('../controller/financeiro.js');

router.get("/", home);
router.get("/condicao-de-pagamento", condPag);

module.exports = router;