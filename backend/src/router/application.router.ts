import express from "express";
import protect from "../middleware/protect.js";
import * as applicationController from "../controllers/application.controller.js";

const applicationRouter = express.Router();

const createHandler =
  applicationController.createApplication as express.RequestHandler;
const getMyHandler =
  applicationController.getMyApplications as express.RequestHandler;
const getByIdHandler =
  applicationController.getApplicationById as express.RequestHandler;
const updateHandler =
  applicationController.updateApplication as express.RequestHandler;

const getAdminApplicationsHandler =
  applicationController.getAllApplicationsAdmin as express.RequestHandler;
const getAdminApplicationHandler =
  applicationController.getApplicationByIdAdmin as express.RequestHandler;
const getAdminStatsHandler =
  applicationController.getApplicationStatsAdmin as express.RequestHandler;
const updateAdminStatusHandler =
  applicationController.updateApplicationStatusAdmin as express.RequestHandler;

// Citizen routes
applicationRouter.post("/create", protect, createHandler);
applicationRouter.get("/my", protect, getMyHandler);

// Admin routes — define these before the generic ID routes
applicationRouter.get("/admin/stats", protect, getAdminStatsHandler);
applicationRouter.get("/admin", protect, getAdminApplicationsHandler);
applicationRouter.get(
  "/admin/:applicationId",
  protect,
  getAdminApplicationHandler,
);
applicationRouter.patch(
  "/admin/:applicationId/status",
  protect,
  updateAdminStatusHandler,
);

// Generic application routes
applicationRouter.get("/:applicationId", protect, getByIdHandler);
applicationRouter.put("/:applicationId", protect, updateHandler);

export default applicationRouter;
