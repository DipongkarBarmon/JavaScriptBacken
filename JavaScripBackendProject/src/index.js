// require('dotenv').config({path:'./env'})
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config();

connectDB();

/*
import mongoose from "mongoose"
import { DB_name } from "./constants.js"

import express from "express"

const app=express()

(async()=>{
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_name}`);
    app.on('error',(error)=>{
        console.log("Error:",error)
        throw error
    });
    

    app.listen(process.env.PORT,()=>{
       console.log(`Server Started at:http:/localhost:${process.env.PORT}`)
    })
    
  } catch (error) {
      console.log("Error:",error)
      throw error
  }
})()
  */
