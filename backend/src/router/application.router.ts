import express from "express";
import protect from "../middleware/protect.js";
import * as applicationController from "../controllers/application.controller.js";

const applicationRouter = express.Router();

applicationRouter
  .route("/create")
  .post(
    protect,
    applicationController.createApplication as unknown as express.RequestHandler,
  );
applicationRouter
  .route("/my")
  .get(
    protect,
    applicationController.getMyApplications as unknown as express.RequestHandler,
  );
applicationRouter
  .route("/:applicationId")
  .get(
    protect,
    applicationController.getApplicationById as unknown as express.RequestHandler,
  );
applicationRouter
  .route("/:applicationId")
  .put(
    protect,
    applicationController.updateApplication as unknown as express.RequestHandler,
  );

export default applicationRouter;
