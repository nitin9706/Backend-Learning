import { Router } from "express";
import {
  addVideoToPlaylist,
  deletePlaylist,
  deleteVideoFromPlaylist,
  makePlaylist,
} from "../controllers/playlist.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../Middlewares/Multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/make-playlist").post(upload.none(), makePlaylist);
router
  .route("/add-video-playlist/:id")
  .patch(upload.none(), addVideoToPlaylist);
router
  .route("/delete-video-playlist/:id")
  .patch(upload.none(), deleteVideoFromPlaylist);
router.route("/delete-playlist/:id").post(upload.none(), deletePlaylist);

export default router;
