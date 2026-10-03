const express = require("express");
const authMiddleware = require("../Middlewares/Auth.middleware");
const accountControllers = require("../Controllers/Account.controllers");

const Router = express.Router();

Router.post("/createAccount",authMiddleware.authMiddleware,accountControllers.createAccountController);

module.exports = Router