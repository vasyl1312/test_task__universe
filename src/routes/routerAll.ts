import express from "express";
import { Router } from "express";
import * as userController from "../controllers/userController";

const router: Router = express.Router();

router.get("/rate", userController.getRate);

export default router;
