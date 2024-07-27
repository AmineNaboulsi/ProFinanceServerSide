const mongoose = require('mongoose');
const Device = new mongoose.Schema({
    name : {
        type : String , 
        required : true
    },
    os : {
        type : String , 
        unique : true , 
        required : true
    },
    datea : {
        type: Date , 
        required : true
    },
    etatmachine : {
        type : Boolean , 
        unique : true , 
        required : true
    },
    isbanned : {
        type : Boolean , 
        unique : true , 
        required : true
    },
})
const DeviceM = mongoose.model("Devices" , Device);
module.exports = DeviceM;