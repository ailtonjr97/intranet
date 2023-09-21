const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const session = require("express-session");
require('./auth.js')(passport);
const home = require("./routes/home.js");
const login = require("./routes/login.js");
const users = require("./routes/users.js");
const info = require("./routes/info.js");
const comercial = require("./routes/comercial.js");
const faturamento = require("./routes/faturamento.js");
const logistica = require("./routes/logistica.js");

function authenticationMiddleware(req, res, next){
  if(req.isAuthenticated() == true){
    return next()
  }else {
    req.session.returnTo = req.originalUrl;
    res.redirect("/login?invalido=true");
  };
}

dotenv.config();
const app = express();


app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

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

app.use("/login", login);
app.use("/home", authenticationMiddleware, home);
app.use("/usuarios", authenticationMiddleware, users);
app.use("/informacoes", authenticationMiddleware, info);
app.use("/comercial", authenticationMiddleware, comercial);
app.use("/faturamento", faturamento);
app.use("/logistica", authenticationMiddleware, logistica);

function verifyJWT(req, res, next){
  const token = req.headers['x-access-token'];
  const index = blacklist.findIndex(token);
  if(index !== -1) return res.status(401).end('Finalizado 1'); 
  jwt.verify(token, process.env.JWTSECRET, (err, decoded)=>{
    if(err) return res.status(401).end('não permitido');

    req.userId = decoded.userId
    next();
  })
}


app.post('/loginjwt', (req, res)=>{
    if(req.body.user === 'ailton' && req.body.password == '123'){
      const token = jwt.sign({userId: 1}, process.env.JWTSECRET, {expiresIn: 300})
      return res.json({auth: true, token});
    }
})

app.get('/rotaautenticada', verifyJWT, (req, res)=>{
  res.send('rota autenticada acessada')
})

app.get('/rotalivre', (req, res)=>{
  res.send('rota liberada')
})

const blacklist = [];
app.post('jwtlogout', (req, res)=>{
  blacklist.push(req.headers['x-access-token'])
  res.send('deslogado')
})


app.listen(process.env.PORT, function () {
  console.log("Node.js funcionando na porta " + process.env.PORT);
});