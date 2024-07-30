const Licence = require("../models/modelLicence");
const usermodel = require("../models/user");
const devicemodel = require("../models/device");

const jwt = require("jsonwebtoken");
const crypto = require("crypto"); 
require('dotenv').config();


const newkey = async (req, res) => {
    const { client, type, version, isMonopost, expireon, etat ,usertk} = req.body;

    if (!client || !type || !version || isMonopost === undefined || !expireon || !etat || !usertk) {
        return res.status(400).json({ "error": "Failed, missing parameters" });
    }
    const check = await Licence.findOne({client:client});
    if(!check){
        try {
        
            const timestamp = new Date().getTime();
    
            const licencekeyS = generateLicenseKey(client, `S-${timestamp}`);
            let licencekeyM = "";
            if(!isMonopost)licencekeyM = generateLicenseKey(client, `M-${timestamp}`);
            
            const Tk = generateLicenseKey(client, `Tk-${timestamp}`);

            const creation_date = new Date();

            const isvalide = true;
            const lkMNumber = 5;
            const userI = await usermodel.findOne({ token: usertk })
            let userinfo = "";

            if(userI){
                userinfo = userI.user;
                const newLicence = new Licence({
                    client,
                    type,
                    version,
                    isMonopost,
                    expireon,
                    etat,
                    isvalide,
                    creation_date ,
                    licencekeyS,
                    licencekeyM,
                    Tk,
                    lkMNumber,
                    userinfo ,
                    os : "" ,
                    deviceinfo : "" ,
                    isvm : false ,
                });
        
                await newLicence.save();
                return res.status(201).json({ status: "Created successfully"});
            }
            else {
                return res.status(201).json({ error: "no permission"});
            }
        } catch (error) {
            return res.status(500).json({ error: "Server Error" });
        }
    }else{
        return res.status(211).json({ error: "Client All ready exists" });
    }
   
}
const generateRandomLetter = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters.charAt(Math.floor(Math.random() * letters.length));
}
const generateLicenseKey = (client, uniqueComponent) => {
    const token = jwt.sign({ client, uniqueComponent }, process.env.JWT_SECRET, { expiresIn: '1y' });
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const filteredToken = hashedToken.replace(/[0-9]/g, '').toUpperCase();

    let licenseKey = '';
    for (let i = 0; i < 24; i++) {
        licenseKey += filteredToken[i] || generateRandomLetter(); 
    }

    const formattedKey = licenseKey.match(/.{1,4}/g).join('-');

    return formattedKey;
}
const listLicence = async (req, res) => {
    const { usertk } = req.body;

    if(!usertk){
        res.json({ require:'e'});
        return;
    }
    const userI = await usermodel.findOne({ token: usertk })
    if(userI){
        try {
            const licence = await Licence.find().
                    select({ __v: 0, Tk : 0});
            res.json(licence);
    
    
        } catch (error) {
            res.json({ error: "Server error" + error })
        }
    }else{
        res.json([])
    }
   
}
const LicenceByID = async (req, res) => {
    const { id , usertk } = req.body;

    if( !id || !usertk){
        res.json({ require:'e'});
        return;
    }
    const userI = await usermodel.findOne({ token: usertk })
    if(userI){
        try {
            const licence = await Licence.findById(id).
                    select({ __v: 0});
            res.json(licence);
    
    
        } catch (error) {
            res.json({ error: "Server error" + error })
        }
    }else{
        res.json({status : false , error : 'licence not valide'})
    }
   
}

const UseLicence = async (req, res) => {
    const { NameD, licence, date_activation ,isvm , os} = req.body;

    if (!NameD || !licence || !date_activation || isvm === undefined || !os) {
        res.json({ status : false ,require: 'e' });
        return;
    }

    try {
        const licencedata = await Licence.findOne({ licencekeyS: licence });
        const licencedataM = await Licence.findOne({ licencekeyM: licence });
        if (licencedata) {
            if (licencedata.isvalide) {
                const filter = { _id: licencedata._id };
                const update = { deviceinfo : NameD ,
                    date_activation : date_activation,
                    isvalide : false ,
                    etat : "En utilisation"
                 };
    
                const updatedLicence = await Licence.findByIdAndUpdate(filter, update, { new: true });
    
                await updatedLicence.save();
    
                addDevice(licencedata._id, NameD, date_activation, isvm, os ,true  ,licencedata.client);
                
                res.json({ status: true ,client :licencedata.client ,version :licencedata.version  , expireon : licencedata.expireon , Tk :licencedata.Tk});
            } else{
                return res.json({ status : false , error: "Licence Expire" });
            }
        }else if(licencedataM){
            if(!licencedataM.isvalide){
                const alldevice  = await devicemodel.find({client : licencedataM._id});
                if(alldevice.length >= licencedataM.lkMNumber +1 ){
                    res.json({ status : false , error: "(LicenseLimitError) You have reached the limit of 5 used machine licenses. Please contact support for further assistance." });
                }else{
                    addDevice(licencedataM._id, NameD, date_activation, isvm, os ,false ,licencedataM.client);
                    res.json({ status: true  ,client :licencedataM.client  , version :licencedataM.version  , expireon : licencedataM.expireon , Tk :licencedataM.Tk});
                }
            }else{
                res.json({ status : false , error: "This license is still valid, Please try to add the server license first." });
            }

        }else{
            return res.json({ status : false , error: "Licence Not valide" });
        }
        
    } catch (error) {
        res.json({status : false , error: "Server error: " + error });
    }
}

const LicenceStillValide = async (req, res) => {
    const { client ,tk } = req.body;

    if (!client || !tk ) {
        res.json({ status : false ,require: 'e' });
        return;
    }

    const licence = await Licence.findOne({Tk : tk , client : client})
    if(licence){
        const currentDate = new Date();
        const expireDate = new Date(licence.expireon);

        if (currentDate < expireDate) res.json({ status : true , isvalide : true  });
        else res.json({ status : true , isvalide : false });
    }else{
        res.json({ status : false ,error: 'The license you are using is not recognized or listed.' });
    }

    
}

const UpdateLicence = async (req, res) => {
    const { id, date_expiredOn, version } = req.body;

    if (!id || !date_expiredOn || !version) {
        res.json({ status: false, require: 'e' });
        return;
    }

    try {
        const licencedata = await Licence.findOne({ _id: id });
        if (licencedata) {
            const filter = { _id: id };
            const update = { 
                expireon: date_expiredOn,
                version: version
            };
            const updatedLicence = await Licence.findByIdAndUpdate(filter, update, { new: true });
            res.json({ status: true, updatedLicence });
        } else {
            res.json({ status: false, error: "Licence Not exist" });
        }
    } catch (error) {
        res.json({ status: false, error: "Server error: " + error });
    }
}

const addDevice = async (clientid , NameD, date_activation, isvm, os ,isS , clientname) =>{

    const device = new devicemodel({
        client : clientid ,
        name : NameD ,
        os : os ,
        datea : date_activation , 
        etatmachine : isvm ,
        isbanned : false ,
        IsServer : isS,
        clientname : clientname
    })
    await device.save();

}













const updateProduct = async (req, res) => {
    const { id, name, description, category, price, quantitystock, status } = req.body;

    if (!id || !name || !category || !description || !price || !status || !quantitystock) {
        res.status(400).json({ "error": "Failed to update missing parametres" })
    }
    const filter = { _id: id }

    const update = {
        name: name,
        status: status,
        description: String,
        category: category,
        price: price,
        currency: String,
        quantitystock: quantitystock
    }
    const updatedProduct = await Product.findOneAndUpdate(filter, update, { new: true })

    await updatedProduct.save();

    res.json({ "done": updatedProduct })
}
const deleteProduct = async (req, res) => {
    const { id } = req.body;
    try {
        const filter = { _id: id };
        const deleteProduct = await Product.findOneAndDelete(filter);
        if (!deleteProduct) {
            res.json({ error: "Product not found" })

        } else {
            await deleteProduct.save();
            res.json({ message: "Product deleted successfully" })
        }
    } catch (error) {
        res.json({ error: "Server error " + error })

    }

}
const getProduct = async (req, res) => {
    const { id } = req.body;
    try {
        const product = await Product.findById(id);
        if (!product)
            res.json({ error: "Product not found" })
        else
            res.json(product)
    } catch (error) {
        res.json({ error: "Server error" + error })
    }
}
const getCategories = async (req, res) => {
    try {
        const category = await Product.find().
            select({ category: 1, _id: 0 });
        if (!product)
            res.json({ error: "Product not found" })
        else
            res.json(product)
    } catch (error) {
        res.json({ error: "Server error" + error })
    }
}
const addquantity = async (req, res) => {
    const { id, quantity } = req.body;
    try {
        const product = await Product.findById(id);
        if (!product)
            res.json({ error: "Product not found" })
        else {
            product.AddQuantity(quantity)
            await product.save();
            res.json({ add: quantity + " Product qantity added successfully" })
        }
    } catch (error) {
        res.json({ error: "Server error" + error })
    }
}
const lessquantity = async (req, res) => {
    const { id, quantity } = req.body;
    try {
        const product = await Product.findById(id);
        if (!product)
            res.json({ error: "Product not found" })
        else {
            const check = await product.LessQuantity(quantity);
            await product.save();
            if (check === false) {
                res.json({ error: "Quantity to much hight" })
            } else {
                res.json({ message: quantity + " Product quantity updated successfully" })
            }
        }
    } catch (error) {
        res.json({ error: "Server error" + error })
    }
}

module.exports = {
    newkey , 
    listLicence ,
    LicenceByID ,
    UseLicence ,
    LicenceStillValide ,
    UpdateLicence
}