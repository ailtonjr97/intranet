const express = require("express");
const router = express.Router();
const passport = require("passport");

const {login} = require('../controller/login.js');

router.get("/", login);
router.post("/autenticar", async(req, res)=>{
    passport.authenticate("local", { failureRedirect: '/login?erro=true', keepSessionInfo: true, failureMessage: true})(req, res, function () {
        res.redirect(req.session.returnTo || '/home');
        delete req.session.returnTo;
    })
});

module.exports = router;