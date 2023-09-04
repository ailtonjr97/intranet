const bcrypt = require('bcryptjs');
const db = require('./db/users.js');
const LocalStrategy = require('passport-local').Strategy;


module.exports = function(passport){

    passport.serializeUser(async(user, done)=>{
        done(null, await db.getUserByUsername(user.email))
    })

    passport.deserializeUser(async(id, done)=>{
        try {
            const user = await db.getUserById(id.id);
            done(null, user);
        } catch (error) {
            console.log(error)
            return done(error, null)
        }
    })

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, 
    async(username, password, done)=>{
        try {
            const user = await db.getUserByUsername(username);
            if(!user) return done(null, false);

            const isValid = bcrypt.compareSync(password, user.password);
            if(!isValid) return done(null, false);
            return done(null, user);
        } catch (error) {
            console.log(error);
            return done(error, false)
        }
    }))

    // console.log(await findUser('admin@fibracem.com'))
}