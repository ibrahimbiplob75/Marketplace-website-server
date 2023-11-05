const express=require("express");
const app=express();
const dotenv = require('dotenv').config();
const cors=require("cors");
const port = process.env.PORT || 5000;


//Middleware
app.use(cors());
app.use(express.json());


app.get("/",(req,res)=>{
    res.send("Port is connected successfully");
});

app.listen(port ,(req,res)=>{
    console.log(`The server is using on ${port} port`);
});