import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
cloudinary.config({ 
      cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
      api_key: process.env.CLOUDINARY_API_KEY,  
      api_secret: process.env.CLOUDINARY_API_SECRET,   
  });


const uploadOnCloudinary=async(logcalFilePath)=>{
   try {
      if(!logcalFilePath) return null;
     const Response= cloudinary.uploader.upload(logcalFilePath,{
        resource_type:'auto'
     })
     console.log('File is uploaded on Cloudinary ', Response.url)
     return Response
   } catch (error) {
      fs.unlinkSync(logcalFilePath);//remove the local save temporary file as the upload operation got failed
      return;
   }
}
export {uploadOnCloudinary}


// cloudinary.v2.uploader
// .upload("dog.mp4", {
//   resource_type: "video", 
//   public_id: "my_dog",
//   overwrite: true, 
//   notification_url: "https://mysite.example.com/notify_endpoint"})
// .then(result=>console.log(result));