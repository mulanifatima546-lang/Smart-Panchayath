import { Router, type RequestHandler } from "express";
import * as citizenController from "../controllers/citizen.controller.js";
import protect from "../middleware/protect.js";

const citizenRouter = Router();

citizenRouter
  .route("/")
  .get(protect, citizenController.getCitizenDashboard as RequestHandler);

export default citizenRouter;
