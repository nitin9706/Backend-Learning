import { Router } from "express";
import { healthcheck } from "../controllers/healthcheck.controller.js";

const router = Router();

router.route("/healtcheck").get(healthcheck);
export default router;
