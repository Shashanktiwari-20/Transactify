const express = require("express");
const Router = express.Router();
const AuthControllers = require("../Controllers/Auth.controllers");

Router.post("/register", AuthControllers.registerUserController);
Router.post("/resend-otp", AuthControllers.resendVerificationOtp);
Router.post("/verify-otp", AuthControllers.verifyRegisterUser);
Router.post("/complete-registration", AuthControllers.completeRegistration);

Router.post("/login", AuthControllers.loginController);
Router.post("/refresh-token", AuthControllers.refreshTokenController);
Router.post("/logout", AuthControllers.logoutController);

module.exports = Router;