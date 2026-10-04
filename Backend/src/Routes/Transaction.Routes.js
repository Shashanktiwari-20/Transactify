const express = require("express");
const Router = express.Router();
const AuthMiddleware = require("../Middlewares/Auth.middleware");
const transactionController = require("../Controllers/Transaction.controllers");

Router.post("/createTransaction",AuthMiddleware.authMiddleware,transactionController.createTransaction);
Router.post("/system/initial-funds",AuthMiddleware.authSystemUserMiddleware,transactionController.createInitialFundsTransaction);

module.exports = Router;