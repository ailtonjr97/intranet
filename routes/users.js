const express = require("express");

const router = express.Router();

const {users, newUser, createUser} = require('../controller/users.js');

router.get("/", users);
router.get("/novo-usuario", newUser);
router.post("/registrar", createUser);

module.exports = router;