const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const home = require("./routes/home.js");
const login = require("./routes/login.js");
const users = require("./routes/users.js");

dotenv.config();
const app = express();


app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.use("/home", home);
app.use("/login", login);
app.use("/usuarios", users)


app.listen(process.env.PORT, function () {
  console.log("Node.js operational at port " + process.env.PORT);
});