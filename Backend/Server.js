require("dotenv").config();
const App = require("./src/App");
const ConnectDB = require("./src/Config/DB");


ConnectDB();

const PORT = process.env.PORT || 3000;

App.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})