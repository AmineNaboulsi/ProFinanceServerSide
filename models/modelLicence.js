const mongoose = require("mongoose");

const modelLk = mongoose.Schema({
    client:String ,
    type:String ,
    version : String ,
    isMonopost : Boolean,
    licencekeyS:String,
    lkSNumber : Number,
    licencekeyM:String,
    lkMNumber : Number,
    expireon:Date,
    creation_date:Date,
    etat:String,
    isvalide : Boolean,
    Tk : String,
    date_activation : Date,
})


const Licence  = mongoose.model("Licence",modelLk);

module.exports = Licence ;