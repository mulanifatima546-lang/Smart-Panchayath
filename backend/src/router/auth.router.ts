import express from "express";
import * as authController from "../controllers/auth.controller.js";
import protect from "../middleware/protect.js";

const authRouter = express.Router();

authRouter.route("/sign-in").post(authController.signIn);
authRouter.route("/sign-up").post(authController.signUp);
authRouter.route("/me").get(protect, (req, res) => {
  return res.status(200).json({
    authenticated: true,
    user: req.user,
  });
});

export default authRouter;
