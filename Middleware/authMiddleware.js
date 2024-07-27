const usermodel = require("../models/user");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    // Extract token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer token
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const userI = await usermodel.findOne({ token: token })

        if (!userI) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        
        next();
       
    } catch (err) {
        return res.status(403).json({ message: 'Failed to authenticate token', err : err });
    }
};

module.exports = authMiddleware;
