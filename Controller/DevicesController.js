const devicemodel = require("../models/device");

const AddDevice = async (req, res) => {
    const { name , os , datea ,etatmachine } = req.body;
    if(!name || !os || !datea || etatmachine === undefined){
        return res.json({"error": "failed, required parametres"});
    }
    /*
    if(t !== process.SECRET_TOKEN){
        return res.json({"error": "No permission"});
    }*/
    try{
        const check = await devicemodel.findOne({name : name});
        if(!check){
            const device = new devicemodel({
                name : name ,
                os : os ,
                datea : datea , 
                etatmachine : etatmachine ,
                isbanned : false
            })
            await device.save();
            
            res.json({status :true , message : 'machine added'})
           

        }else res.json({status :false , error :"machine all ready exists"})

        
    }catch(error){
        res.json({status :false  , error:error})
    }

}

const GetDevice = async (req, res) => {


    const groupedDevices = await devicemodel.aggregate([
        {
            $group: {
                _id: "$clientname",
                count: { $sum: 1 },
                devices: { $push: "$$ROOT" }
            }
        },
        {
            $project: {
                _id: 0,
                clientname: "$_id",
                count: 1,
                devices: {
                    _id: 1,
                    name: 1,
                    datea: 1,
                    etatmachine: 1,
                    isbanned: 1,
                    client: 1,
                    token: 1,
                    clientname : 1
                }
            }
        }
    ]);
    res.json(groupedDevices);


}
const GetDeviceByClient = async (req, res) => {
    const {client} = req.body;
    if(!client) return res.json({status : false ,  error: "failed, required parametres"});
    const devices = await devicemodel.find({client : client}).
    select({ __v: 0});
    res.json(devices);
}

module.exports = {
    AddDevice , GetDevice , GetDeviceByClient
};