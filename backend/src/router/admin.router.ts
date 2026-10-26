import express from "express";
import { signInAdmin } from "../controllers/admin.auth.controller.js";
import protect from "../middleware/protect.js";
import { getAdmin } from "../controllers/admin.controller.js";

const adminRouter = express.Router();

adminRouter.route("/sign-in").post(signInAdmin);
adminRouter.route("/").get(protect, getAdmin);

export default adminRouter;
