import { Router } from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { upload } from "../Middlewares/Multer.middleware.js";

const router = Router();
router.use(verifyJWT);
router.route("/add-comment/:id").post(upload.none(), addComment);
router.route("/update-comment/:id").post(upload.none(), updateComment);
router.route("/delete-comment/:id").post(deleteComment);
router.route("/get-comment/:id").get(getVideoComments);
export default router;
