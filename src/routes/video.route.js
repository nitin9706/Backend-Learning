import {
  getAllVideos,
  getVideoById,
  updateVideo,
  videoUploader,
} from "../controllers/video.controller.js";
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
router.route("/search").get(getAllVideos);
router.route("/videos/:id").get(getVideoById);
router.route("/videos/update/:id").post(
  upload.single(
    {
      name: "thumbnail",
      maxCount: 1,
    },
    updateVideo
  )
);
export default router;
