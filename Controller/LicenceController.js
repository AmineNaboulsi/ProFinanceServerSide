const Licence = require("../models/modelLicence");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); 
require('dotenv').config();


const newkey = async (req, res) => {
    const { client, type, version, isMonopost, expireon, etat } = req.body;

    if (!client || !type || !version || isMonopost === undefined || !expireon || !etat) {
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
                Tk
            });
    
            await newLicence.save();
            return res.status(201).json({ status: "Created successfully"});
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
    try {
        const licence = await Licence.find().
                select({ __v: 0, Tk : 0});
        res.json(licence);


    } catch (error) {
        res.json({ error: "Server error" + error })
    }
}
const LicenceByID = async (req, res) => {
    const { id } = req.body;

    try {
        const licence = await Licence.findById(id).
                select({ __v: 0, Tk : 0});
        res.json(licence);


    } catch (error) {
        res.json({ error: "Server error" + error })
    }
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
    LicenceByID
}