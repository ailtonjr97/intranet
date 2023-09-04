const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
require('./auth.js')(passport);
const home = require("./routes/home.js");
const login = require("./routes/login.js");
const users = require("./routes/users.js");

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

app.use("/login", login);
app.use("/home", authenticationMiddleware, home);
app.use("/usuarios", authenticationMiddleware, users)


app.listen(process.env.PORT, function () {
  console.log("Node.js funcionando na porta " + process.env.PORT);
});