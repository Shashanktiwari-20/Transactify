const accountModel = require("../Models/Account.model");

const createAccountController = async (req,res) => {
    const user = req.user;
    
    const account = await accountModel.create({
        user: user._id
    })

    res.status(201).json({
        message : "account created",
        account
    })
}

module.exports = {createAccountController}