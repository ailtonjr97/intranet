const db = require('../db/users.js')
const bcrypt = require('bcryptjs');
const express = require("express");
const cookieParser = require("cookie-parser");
const mysqlConnect = require('../db')

const app = express();
app.use(cookieParser())

let users = async(req, res)=>{
    try {
        res.render('users/users.ejs', {
            usuarios: await db.users(),
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
        await db.insertUser({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password), salt: 10,
            active: 1
        });
        const conn = await mysqlConnect.connect();

        const user = await conn.query("select * from users order by id desc limit 1");
        const contentsQuery = `INSERT INTO permissions (user_id, visualiza_pedido) VALUES (${user[0][0].id}, 0)`;
        await conn.query(contentsQuery);


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
        const conn = await mysqlConnect.connect();
        const contentsQuery = `SELECT * FROM permissions WHERE id = ${req.params.id}`;

        const contents = await conn.query(contentsQuery);

        res.render('users/editar', {
            user: await db.getUserById(req.params.id),
            contents: contents[0][0].visualiza_pedido
        });
    } catch (error) {
        console.log(error)
        res.render('error')
    }
}

const editarUser = async(req, res)=>{
    try {
        await db.editarUser(req.params.id, req.body);

        const conn = await mysqlConnect.connect();
        const contentsQuery = `update permissions set visualiza_pedido = ${req.body.pedidos} where user_id = ${req.params.id}`;
        await conn.query(contentsQuery);

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