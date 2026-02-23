import { videoUploader } from "../controllers/video.controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { Router } from "express";
import { upload } from "../Middlewares/Multer.middleware.js";

const router = Router();

router.route("/upload").post(
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  videoUploader
);
export default router;
