const express = require("express");

const router = express.Router();

const {
    users,
    newUser,
    createUser,
    logout,
    inativos,
    inativar,
    ativar,
    editar,
    editarUser,
    changePassword,
    changePasswordPost
} = require('../controller/users.js');

router.get("/", users);
router.get("/novo-usuario", newUser);
router.post("/registrar", createUser);
router.get("/logout", logout);
router.get("/inativos", inativos);
router.get("/inativar/:id", inativar);
router.get("/ativar/:id", ativar);
router.get("/editar/:id", editar);
router.post("/editar/:id", editarUser);
router.get("/mudarsenha/:id", changePassword);
router.post("/mudarsenha/:id", changePasswordPost);

module.exports = router;