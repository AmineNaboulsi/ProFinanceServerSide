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

    const devices = await devicemodel.find().
    select({ __v: 0});
    res.json(devices);


}

module.exports = {
    AddDevice , GetDevice
};