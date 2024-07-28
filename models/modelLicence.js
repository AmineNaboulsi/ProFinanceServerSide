const mongoose = require("mongoose");
const { userInfo } = require("os");

const modelLk = mongoose.Schema({
    client:String ,
    type:String ,
    version : String ,
    isMonopost : Boolean,
    licencekeyS:String,
    licencekeyM:String,
    lkMNumber : Number,
    expireon:Date,
    creation_date:Date,
    etat:String,
    isvalide : Boolean,
    Tk : String,
    date_activation : Date,
    userinfo : String,
})


const Licence  = mongoose.model("Licence",modelLk);

module.exports = Licence ;