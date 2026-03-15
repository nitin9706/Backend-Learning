import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import {
  getChannelStats,
  getChannelVideos,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/channel-stat").get(getChannelStats);
router.route("/video-uploaded").get(getChannelVideos);
export default router;
