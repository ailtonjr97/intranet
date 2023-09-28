const axios = require("axios")

const home = async(req, res)=>{
    try {

    } catch (error) {
        console.log(error);
        res.render('error');
    }
};

module.exports = {
    home,
}