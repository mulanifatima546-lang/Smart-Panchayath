import express from "express";

const router = express.Router();

router.use("/auth", (await import("./auth.router.js")).default);
router.use("/admin", (await import("./admin.router.js")).default);
router.use("/panchayat", (await import("./panchayat.router.js")).default);

export default router;
