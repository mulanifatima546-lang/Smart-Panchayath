import { Router, type RequestHandler } from "express";

import * as noticeController from "../controllers/notice.controller.js";
import protect from "../middleware/protect.js";

const noticeRouter = Router();

noticeRouter.use(protect);

// Read notices
noticeRouter.get("/", noticeController.getNotices as unknown as RequestHandler);
noticeRouter.get(
  "/:noticeId",
  noticeController.getNoticeById as unknown as RequestHandler,
);

// Staff management
noticeRouter.post(
  "/",
  noticeController.createNotice as unknown as RequestHandler,
);

noticeRouter.patch(
  "/:noticeId",
  noticeController.updateNotice as unknown as RequestHandler,
);

noticeRouter.patch(
  "/:noticeId/publish",
  noticeController.publishNotice as unknown as RequestHandler,
);

noticeRouter.patch(
  "/:noticeId/withdraw",
  noticeController.withdrawNotice as unknown as RequestHandler,
);

// Citizen read tracking
noticeRouter.patch(
  "/:noticeId/read",
  noticeController.markNoticeAsRead as unknown as RequestHandler,
);

export default noticeRouter;
