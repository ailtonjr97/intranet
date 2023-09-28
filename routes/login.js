const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const db = require("../db/users");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser())
dotenv.config();

const {login} = require('../controller/login.js');

router.get("/", login);

// router.post("/autenticar", async(req, res)=>{
//     passport.authenticate("local", { failureRedirect: '/login?erro=true', keepSessionInfo: true, failureMessage: true})(req, res, function () {
//         res.redirect(req.session.returnTo || '/home');
//         delete req.session.returnTo;
//     })
// });

router.post("/autenticar", async(req, res)=>{
    try {
        const user = await db.getUserByUsername(req.body.username);
        if(!user || user === 'undefined') res.redirect('/login?invalido=true');

        const isValid = bcrypt.compareSync(req.body.password, user.password);
        
        if(isValid){
            const createToken = ()=>{
                return jwt.sign({id: user.id, admin: user.admin}, process.env.JWTSECRET, {expiresIn: 28800})
            };
            const token = createToken()
            res.cookie('jwt', token, {httpOnly: true});
            res.redirect(req.session.returnTo || '/home');
            delete req.session.returnTo;

        }else{
            res.redirect(req.session.returnTo || '/home');
            delete req.session.returnTo;
        }

    } catch (error) {
        console.log(error);
    }
});

module.exports = router;