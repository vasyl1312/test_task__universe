import express from "express";
import { Router } from "express";
import * as userController from "../controllers/userController";
import * as emailController from "../controllers/emailController";


const router: Router = express.Router();

router.get("/rate", userController.getRate);

router.post("/emails", emailController.addEmail);
router.get("/emails", emailController.getAllEmails);
router.delete("/emails", emailController.deleteEmail);


export default router;
