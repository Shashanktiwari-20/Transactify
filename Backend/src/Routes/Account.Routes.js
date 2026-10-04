const express = require("express");
const AuthMiddleware = require("../Middlewares/Auth.middleware");
const accountControllers = require("../Controllers/Account.controllers");

const Router = express.Router();

Router.post("/createAccount",AuthMiddleware.authMiddleware,accountControllers.createAccountController);
Router.get("/getUserAccounts",AuthMiddleware.authMiddleware,accountControllers.getUserAccountsController);
Router.get("/Balance/:accountId",AuthMiddleware.authMiddleware,accountControllers.getAccountBalanceController);

module.exports = Router