import express from "express";
import protect from "../middleware/protect.js";
import * as panchayatController from "../controllers/panchayat.controller.js";

const panchayatRouter = express.Router();

panchayatRouter
  .route("/create")
  .post(protect, panchayatController.createNewPanchayat);

panchayatRouter.route("/").get(protect, panchayatController.getAllPanchatats);
panchayatRouter
  .route("/:panchayatId")
  .get(protect, panchayatController.getPanchayatById);
panchayatRouter
  .route("/:panchayatId")
  .put(protect, panchayatController.updatePanchayat);

export default panchayatRouter;
