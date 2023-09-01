const express = require("express");
const router = express.Router();

const {users, newUser} = require('../controller/users.js');

router.get("/", users);
router.get("/novo-usuario", newUser)

module.exports = router;