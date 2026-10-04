const express = require("express");
const cors = require("cors");
const App = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

App.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

App.use(express.json());
App.use(morgan("dev"));
App.use(cookieParser());


const AuthRouter = require("./Routes/Auth.Routes");
const AccountRouter = require("./Routes/Account.Routes");
const TransactionRouter = require("./Routes/Transaction.Routes");

App.use("/api/auth",AuthRouter);
App.use("/api/account",AccountRouter);
App.use("/api/transaction",TransactionRouter);


module.exports = App;