require("dotenv").config();
const App = require("./src/App");
const ConnectDB = require("./src/Config/DB");


ConnectDB();


App.listen(3000,()=>{
    console.log("server is running on port 3000");
})