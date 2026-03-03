import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../Middlewares/Multer.middleware.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(upload.none(), loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router
  .route("/updateCoverImage")
  .post(upload.single("coverImage"), verifyJWT, updateUserCoverImage);
export default router;
