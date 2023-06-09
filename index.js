import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();
const app = express(); 
const port = 9000 || process.env.port;
const corsOptions ={
    origin:`http://localhost:3000`, 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

mongoose.set("strictQuery", false); 
mongoose.connect("mongodb://vivek1_4:vivek9912@cluster0-shard-00-00.0ymfu.mongodb.net:27017,cluster0-shard-00-01.0ymfu.mongodb.net:27017,cluster0-shard-00-02.0ymfu.mongodb.net:27017/?ssl=true&replicaSet=atlas-q8lt8b-shard-0&authSource=admin&retryWrites=true&w=majority")
import {model,Schema} from "mongoose";

const urlSchema = new Schema({
    urlCode:String,
    urlName:String
})
const urlModel = model("url",urlSchema);
app.post("/createUrl",async(req,res)=>{
    const urlName = req.body.url;
    const fetchedUrl = await urlModel.findOne({ urlName:urlName },{ _id:0,urlCode:1,urlName:1 });
    if(!fetchedUrl){ 
     const urlCode = new Date().getTime().toString(36) + Math.random().toString(36).slice(12)
     urlModel.create({
        urlName:urlName,
        urlCode:urlCode
     })
     res.send(req.hostname+"/"+urlCode);
    }else{
    res.send(req.hostname+"/"+fetchedUrl.urlCode);
   }
 })
app.get("/:urlCode",async(req,res)=>{
    const {urlCode} = req.params;
    const fetchedUrl = await urlModel.findOne({ urlCode },{ urlName:1 });
    if(!fetchedUrl){
        return res.send("invalid url");
    }
    console.log(req.hostname);
    res.redirect(fetchedUrl.urlName)
});
app.get("/",(req,res)=>{
    res.send("<center><h1>Make api calls to fetch data</h1></center>")
})
app.listen(process.env.PORT || 9000,()=>{
    console.log("port is running on",port);
}); 
