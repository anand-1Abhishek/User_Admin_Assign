const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../model/user');

dotenv.config();

secretKey=process.env.JWT_SECRET;

async function verifyToken(req, res, next) {
    let token ;
    
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try {
            token = req.headers.authorization.split(' ')[1];
            
            
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            console.log(decoded);
            req.user = await User.findById(decoded.userId).select("-password");
            //console.log(req.user);
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized User,No token");
        }
    }
    // console.log(object)

}

module.exports = verifyToken;
