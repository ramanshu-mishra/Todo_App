// main server
const types = require("./types");
const express = require("express");
const {router} = require("./routes/todos")
const cors = require("cors");
const app = express();
require("dotenv").config()
const mongoose = require("mongoose");
const url = process.env.url;

app.use(cors({
    origin: "*"
}))
console.log(url);
try{
    mongoose.connect(process.env.url);
    console.log("database added succesfully");
}
catch(e){
    consoole.log("couldnot connect to database\n" + e.message());
}


const PORT = 3000;
app.use(express.json());

app.use("/" , router);

app.listen(PORT, ()=>{
    console.log(`listening at PORT ${PORT}`);
})
