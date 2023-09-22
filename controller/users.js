const db = require('../db/users.js')
const bcrypt = require('bcryptjs');
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser())

let users = async(req, res)=>{
    try {
        res.render('users/users.ejs', {
            users: await db.users(),
            results: await db.countUsers(),
        })
    } catch (error) {
        console.log(error)
        res.render('error')
    }
}

let newUser = async(req, res)=>{
    try {
        res.render('users/newuser.ejs');
    } catch (error) {
        console.log(error)
        res.render('error')
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
        console.log(error)
        res.render('error')
    }
}

const logout = async(req, res)=>{
    res.cookie('jwt', '', {maxAge: 1})
    res.redirect("/login");
}

const inativos = async(req, res)=>{
    try {
        res.render('users/inativos.ejs',{
            users: await db.users(),
            results: await db.inactiveUsersCount()
        })
    } catch (error) {
        console.log(error)
        res.render('error')
    }
}

const inativar = async(req, res)=>{
    try {
        await db.inactivateUser(req.params.id);
        res.redirect("/usuarios");
    } catch (error) {
        console.log(error)
        res.render('error')
    }
}

const ativar = async(req, res)=>{
    try {
        await db.activateUser(req.params.id);
        res.redirect("/usuarios/inativos");
    } catch (error) {
        console.log(error)
        res.render('error')
    }
}

const editar = async(req, res)=>{
    try {
        res.render('users/editar', {
            user: await db.getUserById(req.params.id)
        });
    } catch (error) {
        console.log(error)
        res.render('error')
    }
}

const editarUser = async(req, res)=>{
    try {
        await db.editarUser(req.params.id, req.body);
        res.redirect("/usuarios");
    } catch (error) {
        console.log(error)
        res.render('error')
    }
}

const changePassword = async(req, res)=>{
    try {
        await db.getUserById(req.params.id)
        res.render("users/changePassword", {
            user: await db.getUserById(req.params.id)
        })
    } catch (error) {
        console.log(error)
        res.render('error')
    }
}

const changePasswordPost = async(req, res)=>{
    try {
        let hashedPassword = bcrypt.hashSync(req.body.password);
        await db.changePassword(req.params.id, hashedPassword);
        res.redirect("/usuarios");
    } catch (error) {
        console.log(error)
        res.render('error')
    }
}

module.exports = {
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
}