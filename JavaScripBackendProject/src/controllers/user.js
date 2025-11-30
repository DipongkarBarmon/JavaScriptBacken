
import { User } from '../models/user.js';
import {asyncHandler} from '../utils/asyncHandler.js'
import { apiError } from '../utils/apiError.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import {apiResponse} from '../utils/apiResponse.js'
import jwt from "jsonwebtoken"

const generateAccessTokenAndRefreshToken=async(userId)=>{
   try {
  const user=await User.findById(userId);
       const accessToken=user.generateAccessToken()
       const refreshToken=user.generateRefreshToken()
       user.refreshToken=refreshToken
       user.save({validateBeforeSave:false})
       return {accessToken,refreshToken}
   } catch (error) {
      throw new apiError(500,"Something want wrong while generating refreshToken and accessToken")
   }
}


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

const loginUser=asyncHandler(async(req,res)=>{
     //get user datails from fontend
     //validation-not empty
     //find user
     //check user exist or not
     //check password
     //create accessToken and refreshToken
     //Send cookie
     const {username,email,password}=req.body
     if(!username && !email){
       throw new apiError(400,"Username or Email is required!")
     }
      const user=await User.findOne({$or:[{username},{email}]})
     if(!user){
        throw new apiError(404,"User is not found!")
     }
     
      const isPasswordValid=await user.isPasswordCorrect(password)
   
     if(!isPasswordValid){
      throw new apiError(401,"Invalid user password")
     }

     const {accessToken,refreshToken}=await generateAccessTokenAndRefreshToken(user._id);

     const loggedInUser=await User.findById(user._id).select("-password -refreshToken")
     const options={
       httpOnly:true,
       secure:true
     }

     return res.status(200)
     .cookie('accessToken',accessToken,options)
     .cookie('refreshToken',refreshToken,options)
     .json(
        new apiResponse(
          200,
          {
            user:loggedInUser,accessToken,refreshToken  
          },
          "User successfully login!"
        )
     )

})

const logoutUser=asyncHandler(async(req,res)=>{
      await User.findByIdAndUpdate(
        req.user._id,
        {
          $set:{
            refreshToken:undefined
          }
        },{
          new:true
        }
      )
      const options={
       httpOnly:true,
       secure:true
     }
     return res.status(200)
     .clearCookie('accessToken',options)
     .json(new apiResponse(200,{},"User logout successfully"))
})

const refreshAccessToken=asyncHandler(async(req,res)=>{
    const newComingRefreshToken=req.cookies?.refreshToken||req.body.refreshToken;

    if(!newComingRefreshToken){
      throw new apiError(401,"Unauthorized request")
    }
    try {
      const decodeToken=jwt.verify(newComingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
      const user=await User.findById(decodeToken?._id).select('-password')
      if(!user){
        throw new apiError(404,"User is not found and Invalid refrest token!")
      }
      if(newComingRefreshToken!=user?.refreshToken){
         throw new apiError(401,"Refesh Token is expired or used")
      }
      const {accessToken,newRefreshToken}=await generateAccessTokenAndRefreshToken(user._id);

     const options={
       httpOnly:true,
       secure:true
     }

     return res.status(200)
     .cookie('accessToken',accessToken,options)
     .cookie('refreshToken',newRefreshToken,options)
     .json(
        new apiResponse(
          200,
          {
             accessToken,refreshToken:newRefreshToken  
          },
          "Access Token Refresh!"
        )
     )
    
    } catch (error) {
       throw new apiError(401,error?.message||"Invalid refrest token!")
    }
})

export {register,loginUser,logoutUser,refreshAccessToken}