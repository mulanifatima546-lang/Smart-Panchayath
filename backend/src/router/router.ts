import express from "express";

const router = express.Router();

router.use("/auth", (await import("./auth.router.js")).default);

export default router;