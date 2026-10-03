const express = require("express");
const App = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

App.use(express.json());
App.use(morgan("dev"));
App.use(cookieParser());


const AuthRouter = require("./Routes/Auth.Routes");
const AccountRouter = require("./Routes/Account.Routes");

App.use("/api/auth",AuthRouter);
App.use("/api/account",AccountRouter);



module.exports = App;