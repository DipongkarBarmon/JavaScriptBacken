import { Router } from "express";
import { register } from "../controllers/user.js";
import { upload } from "../middlewares/multer.js";
const router=Router();

router.route('/register').post(
  upload.fields([
    {
       name:'avater',
       maxCount:1
    },
    {
       name:"coverImage",
       maxCount:1
    }
  ]),
  register)

export default router;