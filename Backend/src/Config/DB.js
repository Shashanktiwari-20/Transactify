const mongoose = require("mongoose");
const config = require("./Config");

const ConnectDB = async () => {
    await mongoose.connect(config.MONGO_URI);
    console.log("server is connected to DataBase");
}

module.exports = ConnectDB;