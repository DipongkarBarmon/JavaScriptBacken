require('dotenv').config()
const express=require('express');

const app=express();
const PORT=8000;

app.get('/',(req,res)=>{
   res.send('Hello world') ;
});

app.get('/hello',async(req,res)=>{
    
})

app.get('/login',(req,res)=>{
   return res.send("Please Login your page")
})

app.listen(process.env.PORT,()=>{
  console.log(`Server Started at PORT:${PORT}`);
});