const express = require("express");
const router = express.Router();

const {home, segunda} = require('../controller/financeiro.js');

router.get("/", home);

module.exports = router;