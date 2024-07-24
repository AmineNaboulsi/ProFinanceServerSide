const usermodel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const adduser = async (req, res) => {
    const { user , password ,t} = req.body;
    if(!user || !password || !t){
        return res.json({"error": "failed, required parametres"});
    }
    if(t != process.SECRET_TOKEN){
        return res.json({"error": "No permission"});
    }
    const decodepassword = await bcrypt.hash(password , 10);
    try{
        const check = await usermodel.findOne({user:user});
        if(!check){
            
            const token = jwt.sign({ user }, process.env.JWT_SECRET);

            const newuser = new usermodel({
                user : user ,
                password : decodepassword , 
                token : token
            })
            await newuser.save();
            
            res.json({status :'user added'})
            

        }else res.json({error :"user all ready exists"})

    }catch(error){
        res.json({error:error})
    }

}
const loginuser = async(req , res) => {
    const {user , password }  = req.body;
    if(!user || !password){
        return res.json({error :"Missing parametres"});
    }
    try{
        const checkauthentification = await usermodel.findOne({user : user});
        if(checkauthentification){
            
            const matchimatchi = await bcrypt.compare(password , checkauthentification.password );
            if(matchimatchi) res.json({status : true ,message : "login successfully" , 'tk':checkauthentification.token})  ; 
            else res.json({status : false ,message : "failed login"})  ; 
            
        }else{
            res.status(401).json({error :"auth failed"});
        }
    }catch(error){
        console.log("ERROR / "+error)
        res.status(404).json({error :error});
    }
    
}

const validate_token = async(req , res) => {
    const {usertk }  = req.body;
    if(!usertk){
        return res.json({error :"Error"});
    }
    try{
        const checkTK = await usermodel.findOne({token : usertk});
        if(checkTK){
            res.json({isValid : true })  ; 
            
        }else{
            res.json({isValid : false })  ; 
        }
    }catch(error){
        console.log("ERROR / "+error)
        res.status(404).json({error :error});
    }
    
}

module.exports = {
    adduser , loginuser , validate_token
};