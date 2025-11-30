import { Router } from "express";
import { register,loginUser ,logoutUser,refreshAccessToken} from "../controllers/user.js";
import { upload } from "../middlewares/multer.js";
import varifyJwt from "../middlewares/authorization.js";
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


router.route('/login').post(loginUser)

router.route('/logout').post(varifyJwt,logoutUser)
router.route('/refesh-token').post(refreshAccessToken)
export default router;