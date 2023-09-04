const db = require('../db/users.js')
const bcrypt = require('bcryptjs');

let users = async(req, res)=>{
    try {
        res.render('users/users.ejs', {
            users: await db.users(),
            results: await db.countUsers()
        })
    } catch (error) {
        res.send(error)
    }
}

let newUser = async(req, res)=>{
    try {
        res.render('users/newuser.ejs')
    } catch (error) {
        res.send(error)
    }
}

let createUser = async (req, res)=>{
    try {
        db.insertUser({name: req.body.name, email: req.body.email, password: bcrypt.hashSync(req.body.password), salt: 10});
        res.redirect("/usuarios");
    } catch (error) {
        res.send(error)
    }
}

let teste = async(req, res)=>{
    console.log(req.body)
}

module.exports = {
    users,
    newUser,
    createUser,
    teste
}