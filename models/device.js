const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Device = new mongoose.Schema({
    name : {
        type : String ,
        required : true
    },
    os : {
        type : String , 
        required : true
    },
    datea : {
        type: Date , 
        required : true
    },
    etatmachine : {
        type : Boolean , 
        required : true
    },
    isbanned : {
        type : Boolean , 
        required : true
    },
    client: {
        type: Schema.Types.ObjectId,
        required: true
    },
    clientname: {
        type: String,
        required: true
    },
    IsServer :{
        type : Boolean , 
        required : true
    }
})
const DeviceM = mongoose.model("Devices" , Device);
module.exports = DeviceM;