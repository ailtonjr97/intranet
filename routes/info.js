const express = require("express");
const router = express.Router();

const {info, empresas} = require('../controller/info.js');

router.get("/", info);

router.get("/empresas", empresas);

module.exports = router;