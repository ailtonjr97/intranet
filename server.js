const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const db = require("./db/users");
const mysqlConnect = require('./db');
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
const financeiro = require("./routes/financeiro.js");
const compras = require("./routes/compras.js");
dotenv.config();
const app = express();


app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

function authenticationMiddleware(req, res, next){
  const token = req.cookies.jwt;
  if(token){
    jwt.verify(token, process.env.JWTSECRET, (err)=>{
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

function admin(req, res, next){
  const token = req.cookies.jwt;
  if(token){
    jwt.verify(token, process.env.JWTSECRET, async(err, decodedToken)=>{
      if(err){
        req.session.returnTo = req.originalUrl;
        res.redirect("/login?invalido=true");
      } else {
        let user = await db.getUserByIntranetID(decodedToken.id);
        if(user.admin != 1){
          res.send('Área restrita aos administradores');
        }else{
          next()
        }
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
        res.locals.user = null;
        next();
      } else {
        let user = await db.getUserByIntranetID(decodedToken.id);
        if(user == undefined){
          res.send('Usuário não existente no sistema')
        }else{
          if(user.active !== 1){
            res.send('Usuário inativo')
          }else{
            const conn = await mysqlConnect.connect();
  
            const contentsQuery = `select u.name, p.visualiza_pedido from users u left join permissions p on u.id = p.user_id where u.id = ${user.id}`;
            const contents = await conn.query(contentsQuery);
  
            res.locals.user = user;
            res.locals.ver_pedido = contents[0][0].visualiza_pedido;
            next();
          }
        }
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
app.use("/usuarios", admin, users);
app.use("/informacoes", authenticationMiddleware, info);
app.use("/comercial", authenticationMiddleware, comercial);
app.use("/faturamento", authenticationMiddleware, faturamento);
app.use("/logistica", authenticationMiddleware, logistica);
app.use("/financeiro", authenticationMiddleware, financeiro);
app.use("/compras", authenticationMiddleware, compras);

app.listen(process.env.PORT, function () {
  console.log("Node.js funcionando na porta " + process.env.PORT);
});