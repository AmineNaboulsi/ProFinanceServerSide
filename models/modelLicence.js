const mongoose = require("mongoose");

const modelLk = mongoose.Schema({
    client:String ,
    type:String ,
    version : String ,
    isMonopost : Boolean,
    licencekeyS:String,
    licencekeyM:String,
    expireon:Date,
    etat:String,//En Utilisation  - Annuler
    isvalide : Boolean,
    Tk : String
})


const Licence  = mongoose.model("Licence",modelLk);

module.exports = Licence ;