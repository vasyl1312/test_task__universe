import express from "express";
import { Router } from "express";
import * as userController from "../controllers/userController";
import * as emailController from "../controllers/emailController";
import * as metricController from "../controllers/metricController";

const router: Router = express.Router();

router.get("/rate", userController.getRate);
router.post("/rate", userController.postRate);

router.post("/emails", emailController.addEmail);
router.get("/emails", emailController.getAllEmails);
router.delete("/emails", emailController.deleteEmail);

router.get("/metrics", metricController.getMetrics);
// router.post("/metrics", metricController.addMetrics);

export default router;
