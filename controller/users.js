const db = require('../db/users.js')
const bcrypt = require('bcryptjs');

let users = async(req, res)=>{
    try {
        res.render('users/users.ejs', {
            users: await db.users(),
            results: await db.countUsers()
        })
    } catch (error) {
        res.send(error);
    }
}

let newUser = async(req, res)=>{
    try {
        res.render('users/newuser.ejs');
    } catch (error) {
        res.send(error);
    }
}

let createUser = async (req, res)=>{
    try {
        db.insertUser({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password), salt: 10,
            active: 1
        });
        res.redirect("/usuarios");
    } catch (error) {
        res.send(error);
    }
}

let teste = async(req, res)=>{
    console.log(req.body);
}

const logout = async(req, res)=>{
    req.logout(()=>{
        res.redirect("/login");
    });
}

const inativos = async(req, res)=>{
    res.render('users/inativos.ejs',{
        users: await db.users(),
        results: await db.inactiveUsersCount()
    })
}

const inativar = async(req, res)=>{
    try {
        await db.inactivateUser(req.params.id);
        res.redirect("/usuarios");
    } catch (error) {
        console.log(error);
    }
}

const ativar = async(req, res)=>{
    try {
        await db.activateUser(req.params.id);
        res.redirect("/usuarios/inativos");
    } catch (error) {
        console.log(error);
    }
}

const editar = async(req, res)=>{
    try {
        res.render('users/editar', {
            user: await db.getUserById(req.params.id)
        });
    } catch (error) {
        console.log(error);
    }
}

const editarUser = async(req, res)=>{
    try {
        await db.editarUser(req.params.id, req.body);
        res.redirect("/usuarios");
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    users,
    newUser,
    createUser,
    teste,
    logout,
    inativos,
    inativar,
    ativar,
    editar,
    editarUser
}