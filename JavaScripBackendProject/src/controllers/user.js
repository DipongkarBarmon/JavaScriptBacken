import e, { response } from 'express';
import { User } from '../models/user.js';
import {asyncHandler} from '../utils/asyncHandler.js'
import { apiError } from '../utils/apiError.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import {apiResponse} from '../utils/apiResponse.js'

const register=asyncHandler(async(req,res)=>{
     //get user details from frontent
     //validation -not empty
     //check user allready exists:user name,email
     //check for image ,check for avater
     //create user object-create entry in db
     //remove password and refresh token field from response
     //check for user creation 
     //return res

     const {fullname,username,email,password}=req.body;

     if([username,fullname,email,password].some((field)=>field?.trim()==="")){
        throw new apiError(400,"All fields are required")
     }
     const user=await User.findOne({$or:[{username},{email}]}) 
      if(user){
          throw new apiError(409,"User already exists");
      }
      //console.log("fukc you" ,req.files.avater[0].path)
      const avaterLocalPath=req.files?.avater[0]?.path;
      //const coverImageLocalPath=req.files?.coverImage[0]?.path;
      // console.log(avaterLocalPath)
      let coverImageLocalPath;
      if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
         coverImageLocalPath=req.files.coverImage[0].path;
      }
      if(!avaterLocalPath){ 
        throw new apiError(400,"Avater files is required!")
      }

      const avater=await uploadOnCloudinary(avaterLocalPath);
      const coverImage=await uploadOnCloudinary(coverImageLocalPath);
      //console.log("I miss you ",avater);
      if(!avater){
         throw new apiError(400,"Avater files is required!")
      }

      const createUser=await User.create({
          fullname,
          username:username.toLowerCase(),
          email,
          password,
          avater:avater.url,
          coverImage:coverImage?.url||""

      })
      const findUser=await User.findById(createUser._id).select("-password -refreshToken")
      if(!findUser){
        throw new apiError(500,"Something was wrong while registered the user")
      }

      res.status(201).json(
          new apiResponse(200,"User registered successfully!") 
      )
})

export {register}