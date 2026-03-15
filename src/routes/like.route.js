import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../controllers/like.controller.js";
const router = Router();

router.use(verifyJWT);

router.route("/videoLike/:id").post(toggleVideoLike);
router.route("/commentLike/:id").post(toggleCommentLike);
router.route("/tweetLike/:id").post(toggleTweetLike);
router.route("/getLikedVideos/:id").get(getLikedVideos);

export default router;
