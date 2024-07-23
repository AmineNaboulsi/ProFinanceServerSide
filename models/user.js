const mongoose = require('mongoose');
const user = new mongoose.Schema({
    user : {
        type : String , 
        unique : true , 
        required : true
    },
    password : {
        type: String , 
        required : true
    },
    token : {
        type: String , 
        required : true
    }
})
const usermodele = mongoose.model("user" , user);
module.exports = usermodele;