let users = async(req, res)=>{
    res.render('users/users.ejs')
}

let newUser = async(req, res)=>{
    res.render('users/newuser.ejs')
}

module.exports = {
    users,
    newUser
}