const jwt = require("jsonwebtoken");
const userModel = require("../Models/user.model");
const config = require("../Config/Config");
const tokenBlackListModel = require("../Models/TokenBlackList.model");

const authMiddleware = async (req,res,next) => {
    const token = req.cookies.refreshToken || req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(401).json({
            message : "Unauthorized access, token is missing"
        })
    }

    const isBlacklisted = await tokenBlackListModel.findOne({token})

    if(isBlacklisted){
        return res.status(401).json({
            message : "Unauthorized access, token is invalid"
        })
    }


    try{
        const decoded = jwt.verify(token, config.JWT_SECRET);

        const user = await userModel.findById(decoded.userId);

        if(!user){
            return res.status(401).json({
                message : "user not found"
            })
        }

        req.user = user

        return next()

    }catch(error){
        return res.status(401).json({
            message : error.message
        })
    }

}

const authSystemUserMiddleware = async (req,res,next) => {
    const token = req.cookies.refreshToken || req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(401).json({
            message : "Unauthorized access, token is missing"
        })
    }

    const isBlacklisted = await tokenBlackListModel.findOne({token})

    if(isBlacklisted){
        return res.status(401).json({
            message : "Unauthorized access, token is invalid"
        })
    }

    try{
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await userModel.findById(decoded.userId).select("+systemUser");

        if(!user){
            return res.status(401).json({
                message : "user not found"
            })
        }

        if(!user.systemUser){
            return res.status(401).json({
                message : "Unauthorized access, user is not a system user"
            })
        }

        req.user = user

        return next()

    }catch(error){
        return res.status(401).json({
            message : error.message
        })
    }
}

module.exports = {authMiddleware, authSystemUserMiddleware}