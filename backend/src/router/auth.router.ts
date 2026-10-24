import express from "express";
import * as authController from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.route("/sign-in").post(authController.signIn);
authRouter.route("/sign-up").post(authController.signUp);

export default authRouter;