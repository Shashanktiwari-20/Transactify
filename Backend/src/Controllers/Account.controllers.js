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

const getUserAccountsController = async (req,res) => {
    const user = req.user;

    const accounts = await accountModel.find({user: user._id});

    res.status(200).json({
        message : "User accounts retrieved successfully",
        accounts
    })
}

const getAccountBalanceController = async (req,res) => {
    const {accountId} = req.params;

    const account = await accountModel.findOne({_id: accountId, user: req.user._id});

    if(!account){
        return res.status(404).json({
            message : "Account not found"
        })
    }

    const balance = await account.getBalance();

    res.status(200).json({
        message : "Account balance retrieved successfully",
        balance
    })
}

module.exports = {createAccountController, getUserAccountsController, getAccountBalanceController}