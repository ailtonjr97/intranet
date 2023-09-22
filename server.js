const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const db = require("./db/users");
const cookieParser = require("cookie-parser");
const session = require("express-session");
require('./auth.js')(passport);
const home = require("./routes/home.js");
const login = require("./routes/login.js");
const users = require("./routes/users.js");
const info = require("./routes/info.js");
const comercial = require("./routes/comercial.js");
const faturamento = require("./routes/faturamento.js");
const logistica = require("./routes/logistica.js");
dotenv.config();
const app = express();


app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser())

function authenticationMiddleware(req, res, next){
  const token = req.cookies.jwt;
  if(token){
    jwt.verify(token, process.env.JWTSECRET, (err, decodedToken)=>{
      if(err){
        req.session.returnTo = req.originalUrl;
        res.redirect("/login?invalido=true");
      } else {
        next();
      }
    })
  }else{
    req.session.returnTo = req.originalUrl;
    res.redirect("/login?invalido=true");
  }
}

const checkUser = (req, res, next)=>{
  const token = req.cookies.jwt

  if(token){
    jwt.verify(token, process.env.JWTSECRET, async(err, decodedToken)=>{
      if(err){
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        let user = await db.getUserById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    })
  } else{
    res.locals.user = null;
    next();
  }
}


app.use(
  session({
    secret: process.env.PASSWORD,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 8 * 60 * 60 * 1000}
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.get("/", async(req, res)=>{
  res.redirect("/login")
});

app.use("*", checkUser)
app.use("/login", login);
app.use("/home", authenticationMiddleware, home);
app.use("/usuarios", authenticationMiddleware, users);
app.use("/informacoes", authenticationMiddleware, info);
app.use("/comercial", authenticationMiddleware, comercial);
app.use("/faturamento", authenticationMiddleware, faturamento);
app.use("/logistica", authenticationMiddleware, logistica);

app.listen(process.env.PORT, function () {
  console.log("Node.js funcionando na porta " + process.env.PORT);
});