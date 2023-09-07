const express = require("express");
const router = express.Router();

const {info} = require('../controller/info.js');

router.get("/", info);

module.exports = router;