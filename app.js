const express = require("express");
const apiDoc = require("./modules/v1/Api_document/route")
const colors = require("colors")
const dotenv = require("dotenv");
const cors = require("cors"); // Import CORS

dotenv.config();
const app = express()
app.use(express.json())
app.use(cors());
app.use("/api-doc",apiDoc)

// app.use(require('./middleware/validators').extractHeaderLanguage);
app.use(require('./middleware/validators').validateApiKey);
app.use(require('./middleware/validators').validateHeaderToken);

let app_routing = require("./modules/app_routing")
app_routing.v1(app)
try{
    app.listen(process.env.PORT || 3000,()=>{
        console.log(`App Started on ${process.env.PORT} PORT`.bgGreen)
        console.log(`Api Documentation : ${process.env.URL}${process.env.PORT}/api-doc`.bgCyan)
    })
}catch(error){
    console.log(`Error in Server :${error}`.bgRed.white)
}