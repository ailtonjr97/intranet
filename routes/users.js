const express = require("express");

const router = express.Router();

const {users, newUser, createUser, logout, inativos, inativar, ativar, editar, editarUser} = require('../controller/users.js');

router.get("/", users);
router.get("/novo-usuario", newUser);
router.post("/registrar", createUser);
router.get("/logout", logout);
router.get("/inativos", inativos);
router.get("/inativar/:id", inativar);
router.get("/ativar/:id", ativar);
router.get("/editar/:id", editar);
router.post("/editar/:id", editarUser);

module.exports = router;