const express = require('express')
const cors =require('cors')
const app = express();
const mongoose =  require('mongoose');

const profile = require('./router/profile')
const auth = require('./router/auth')
require('dotenv').config();
app.use(express.json());
app.use(cors());



//mogodb connection
const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongodb is connected");
        
    }
    catch(err){
        console.log("Mogodb is not connected",err);
        
    }
}

 connectDB();



//api routes
app.use('/api/profile',profile)
app.use('/api/auth',auth)
//password yogomanojbro
//username UmlhVHpI4epxKkM8

const Port = 8000

app.get("/",(req,res)=>{
    res.send("welcome")
})

app.listen(Port,()=>{
console.log(`Server s running on http://localhost:${Port}`)
})