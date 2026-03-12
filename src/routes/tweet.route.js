import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import {
  deleteTweet,
  getAllTweet,
  makeTweet,
  updateTweet,
} from "../controllers/tweet.controller.js";
import { upload } from "../Middlewares/Multer.middleware.js";
const router = Router();

router.use(verifyJWT);

router.route("/get-tweet/:id").get(getAllTweet);
router.route("/make-tweet").post(upload.single("image"), makeTweet);
router.route("/update-tweet/:id").patch(upload.none(), updateTweet);
router.route("/delete-tweet/:id").post(deleteTweet);
export default router;
