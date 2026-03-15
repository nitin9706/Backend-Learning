import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";
const router = Router();

router.use(verifyJWT);
router.route("/toggleSub/:id").post(toggleSubscription);
router.route("/channelSubscriber/:id").get(getUserChannelSubscribers);
router.route("/subscribedChannel/:id").get(getSubscribedChannels);

export default Router;
