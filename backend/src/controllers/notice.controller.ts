import mongoose, { Types } from "mongoose";
import type { Request, Response } from "express";
import Notice, {
  NOTICE_AUDIENCES,
  NOTICE_CATEGORIES,
  NOTICE_TYPES,
  type INotice,
  type NoticeStatus,
} from "../models/notice.model.js";

type AuthRequest = Request & {
  user?: Express.User;
};

const isValidId = (id: unknown): id is string =>
  typeof id === "string" && mongoose.isValidObjectId(id);

const getUserId = (req: AuthRequest): Types.ObjectId | null => {
  const id = req.user?._id ?? req.user?.id;
  return id && mongoose.isValidObjectId(id) ? new Types.ObjectId(id) : null;
};

const getPanchayatId = (req: AuthRequest): string | null => {
  const value = req.user?.panchayatId ?? req.user?.panchayat;

  if (value && typeof value === "object" && "_id" in value) {
    return String(value._id);
  }

  return value && mongoose.isValidObjectId(value) ? String(value) : null;
};

const isStaff = (req: AuthRequest): boolean =>
  req.user?.role === "operator" || req.user?.role === "administrator";

const isAdmin = (req: AuthRequest): boolean =>
  req.user?.role === "administrator";

const sendError = (res: Response, code: number, message: string) =>
  res.status(code).json({ status: false, message });

const handleError = (res: Response, error: unknown) => {
  if (error instanceof mongoose.Error.ValidationError) {
    return sendError(res, 400, error.message);
  }

  if (error instanceof mongoose.Error.CastError) {
    return sendError(res, 400, "Invalid ID or field value.");
  }

  console.error("Notice controller error:", error);
  return sendError(res, 500, "An unexpected server error occurred.");
};

const getStaffFilter = (req: AuthRequest): mongoose.mongo.Filter<INotice> => {
  if (isAdmin(req)) return {};

  const panchayatId = getPanchayatId(req);
  return panchayatId
    ? { panchayatId: new Types.ObjectId(panchayatId) }
    : { _id: { $exists: false } };
};

const getCitizenFilter = (req: AuthRequest): mongoose.mongo.Filter<INotice> => {
  const panchayatId = getPanchayatId(req);
  const citizenId = getUserId(req);

  if (!panchayatId || !citizenId) {
    return { _id: { $exists: false } };
  }

  return {
    panchayatId: new Types.ObjectId(panchayatId),
    status: "published",
    $and: [
      {
        $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
      },
      {
        $or: [
          { audience: "panchayat" },
          {
            audience: "selected_citizens",
            recipients: citizenId,
          },
        ],
      },
    ],
  };
};

// POST /api/notices
export const createNotice = async (req: AuthRequest, res: Response) => {
  try {
    if (!isStaff(req)) {
      return sendError(res, 403, "You cannot create notices.");
    }

    const {
      title,
      description,
      category = "General",
      noticeType = "general",
      panchayatId: requestedPanchayatId,
      audience = "panchayat",
      recipients = [],
      applicationId = null,
      attachments = [],
      expiresAt = null,
      status = "draft",
    } = req.body;

    const ownPanchayatId = getPanchayatId(req);
    const targetPanchayatId = isAdmin(req)
      ? requestedPanchayatId || ownPanchayatId
      : ownPanchayatId;

    if (!targetPanchayatId || !isValidId(String(targetPanchayatId))) {
      return sendError(res, 400, "A valid Panchayat ID is required.");
    }

    if (
      !isAdmin(req) &&
      requestedPanchayatId &&
      String(requestedPanchayatId) !== ownPanchayatId
    ) {
      return sendError(
        res,
        403,
        "You can only create notices for your own Panchayat.",
      );
    }

    if (
      typeof title !== "string" ||
      title.trim().length < 3 ||
      typeof description !== "string" ||
      description.trim().length < 3
    ) {
      return sendError(
        res,
        400,
        "Title and description must contain at least 3 characters.",
      );
    }

    if (!(NOTICE_CATEGORIES as readonly string[]).includes(category)) {
      return sendError(res, 400, "Invalid notice category.");
    }

    if (!(NOTICE_TYPES as readonly string[]).includes(noticeType)) {
      return sendError(res, 400, "Invalid notice type.");
    }

    if (!(NOTICE_AUDIENCES as readonly string[]).includes(audience)) {
      return sendError(res, 400, "Invalid notice audience.");
    }

    if (!["draft", "published"].includes(status)) {
      return sendError(res, 400, "A new notice must be a draft or published.");
    }

    if (!Array.isArray(recipients) || !Array.isArray(attachments)) {
      return sendError(res, 400, "Recipients and attachments must be arrays.");
    }

    if (recipients.some((id: unknown) => !isValidId(id))) {
      return sendError(res, 400, "One or more recipient IDs are invalid.");
    }

    if (audience === "selected_citizens" && recipients.length === 0) {
      return sendError(res, 400, "Select at least one recipient.");
    }

    if (noticeType === "application" && !isValidId(applicationId)) {
      return sendError(
        res,
        400,
        "A valid application ID is required for application notices.",
      );
    }

    const userId = getUserId(req);
    if (!userId) {
      return sendError(res, 401, "Authenticated user ID is missing.");
    }

    const expiry = expiresAt ? new Date(expiresAt) : null;

    if (expiry && Number.isNaN(expiry.getTime())) {
      return sendError(res, 400, "Invalid expiry date.");
    }

    const notice = await Notice.create({
      title: title.trim(),
      description: description.trim(),
      category,
      noticeType,
      panchayatId: new Types.ObjectId(String(targetPanchayatId)),
      audience,
      recipients:
        audience === "selected_citizens"
          ? [...new Set(recipients.map((id: string) => String(id)))]
          : [],
      applicationId:
        noticeType === "application" ? new Types.ObjectId(applicationId) : null,
      attachments,
      status,
      createdBy: userId,
      publishedAt: status === "published" ? new Date() : null,
      expiresAt: expiry,
    });

    return res.status(201).json({
      status: true,
      message:
        status === "published"
          ? "Notice published successfully."
          : "Notice saved as draft.",
      data: notice,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// GET /api/notices?page=1&limit=10&search=&category=&status=
export const getNotices = async (req: AuthRequest, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";
    const category =
      typeof req.query.category === "string" ? req.query.category : "";
    const requestedStatus =
      typeof req.query.status === "string" ? req.query.status : "";

    let filter: mongoose.mongo.Filter<INotice>;

    if (isStaff(req)) {
      filter = getStaffFilter(req);

      if (!isAdmin(req) && !getPanchayatId(req)) {
        return sendError(res, 403, "Your account has no Panchayat assigned.");
      }

      if (
        requestedStatus &&
        ["draft", "published", "withdrawn"].includes(requestedStatus)
      ) {
        filter.status = requestedStatus as NoticeStatus;
      }
    } else if (req.user?.role === "citizen") {
      filter = getCitizenFilter(req);
    } else {
      return sendError(res, 403, "You cannot view notices.");
    }

    if (category) {
      if (!(NOTICE_CATEGORIES as readonly string[]).includes(category)) {
        return sendError(res, 400, "Invalid notice category.");
      }
      filter.category = category as (typeof NOTICE_CATEGORIES)[number];
    }

    if (search) {
      filter.$and = [
        ...(filter.$and ?? []),
        {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        },
      ];
    }

    const [notices, total] = await Promise.all([
      Notice.find(filter)
        .select("-readBy")
        .populate("createdBy", "name")
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Notice.countDocuments(filter),
    ]);

    let data = notices;

    // Return isRead for citizens without exposing other citizens' read records.
    if (req.user?.role === "citizen") {
      const citizenId = getUserId(req);

      if (citizenId) {
        const readNotices = await Notice.find({
          ...filter,
          "readBy.citizenId": citizenId,
        })
          .select("_id")
          .lean();

        const readIds = new Set(readNotices.map((item) => String(item._id)));

        data = notices.map((notice) => ({
          ...notice,
          isRead: readIds.has(String(notice._id)),
        }));
      }
    }

    return res.status(200).json({
      status: true,
      message: "Notices fetched successfully.",
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// GET /api/notices/:noticeId
export const getNoticeById = async (req: AuthRequest, res: Response) => {
  try {
    const { noticeId } = req.params;

    if (!isValidId(noticeId)) {
      return sendError(res, 400, "Invalid notice ID.");
    }

    if (!isStaff(req) && req.user?.role !== "citizen") {
      return sendError(res, 403, "You cannot view this notice.");
    }

    const filter = {
      _id: new Types.ObjectId(noticeId),
      ...(isStaff(req) ? getStaffFilter(req) : getCitizenFilter(req)),
    };

    const notice = await Notice.findOne(filter)
      .populate("createdBy", "name")
      .lean();

    if (!notice) {
      return sendError(res, 404, "Notice not found.");
    }

    const citizenId = getUserId(req);
    const isRead = citizenId
      ? Boolean(
          await Notice.exists({
            _id: notice._id,
            "readBy.citizenId": citizenId,
          }),
        )
      : false;

    const { readBy: _readBy, ...safeNotice } = notice;

    return res.status(200).json({
      status: true,
      message: "Notice fetched successfully.",
      data: { ...safeNotice, isRead },
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// PATCH /api/notices/:noticeId
// Only drafts can be edited.
export const updateNotice = async (req: AuthRequest, res: Response) => {
  try {
    if (!isStaff(req)) {
      return sendError(res, 403, "You cannot update notices.");
    }

    const { noticeId } = req.params;

    if (!isValidId(noticeId)) {
      return sendError(res, 400, "Invalid notice ID.");
    }

    const notice = await Notice.findOne({
      _id: noticeId,
      ...getStaffFilter(req),
    });

    if (!notice) {
      return sendError(res, 404, "Notice not found.");
    }

    if (notice.status !== "draft") {
      return sendError(res, 400, "Only draft notices can be edited.");
    }

    const allowedFields = [
      "title",
      "description",
      "category",
      "noticeType",
      "audience",
      "recipients",
      "applicationId",
      "attachments",
      "expiresAt",
    ] as const;

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        (notice as unknown as Record<string, unknown>)[field] = req.body[field];
      }
    }

    // Do not allow client-supplied IDs, status, or read records to be changed.
    if (
      notice.audience === "selected_citizens" &&
      notice.recipients.length === 0
    ) {
      return sendError(res, 400, "Select at least one recipient.");
    }

    if (notice.noticeType === "application" && !notice.applicationId) {
      return sendError(
        res,
        400,
        "Application-related notices require an application ID.",
      );
    }

    await notice.save();

    return res.status(200).json({
      status: true,
      message: "Notice updated successfully.",
      data: notice,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// PATCH /api/notices/:noticeId/publish
export const publishNotice = async (req: AuthRequest, res: Response) => {
  try {
    if (!isStaff(req)) {
      return sendError(res, 403, "You cannot publish notices.");
    }

    const { noticeId } = req.params;

    if (!isValidId(noticeId)) {
      return sendError(res, 400, "Invalid notice ID.");
    }

    const notice = await Notice.findOne({
      _id: noticeId,
      ...getStaffFilter(req),
    });

    if (!notice) {
      return sendError(res, 404, "Notice not found.");
    }

    if (notice.status !== "draft") {
      return sendError(res, 400, "Only draft notices can be published.");
    }

    if (notice.expiresAt && notice.expiresAt <= new Date()) {
      return sendError(res, 400, "The expiry date must be in the future.");
    }

    notice.status = "published";
    notice.publishedAt = new Date();
    await notice.save();

    return res.status(200).json({
      status: true,
      message: "Notice published successfully.",
      data: notice,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// PATCH /api/notices/:noticeId/withdraw
export const withdrawNotice = async (req: AuthRequest, res: Response) => {
  try {
    if (!isStaff(req)) {
      return sendError(res, 403, "You cannot withdraw notices.");
    }

    const { noticeId } = req.params;

    if (!isValidId(noticeId)) {
      return sendError(res, 400, "Invalid notice ID.");
    }

    const notice = await Notice.findOne({
      _id: noticeId,
      ...getStaffFilter(req),
    });

    if (!notice) {
      return sendError(res, 404, "Notice not found.");
    }

    if (notice.status !== "published") {
      return sendError(res, 400, "Only published notices can be withdrawn.");
    }

    notice.status = "withdrawn";
    await notice.save();

    return res.status(200).json({
      status: true,
      message: "Notice withdrawn successfully.",
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// PATCH /api/notices/:noticeId/read
export const markNoticeAsRead = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== "citizen") {
      return sendError(res, 403, "Only citizens can mark notices as read.");
    }

    const { noticeId } = req.params;
    const citizenId = getUserId(req);

    if (!isValidId(noticeId) || !citizenId) {
      return sendError(res, 400, "Invalid notice or citizen ID.");
    }

    const filter = {
      _id: new Types.ObjectId(noticeId),
      ...getCitizenFilter(req),
    };

    const notice = await Notice.findOneAndUpdate(
      {
        ...filter,
        "readBy.citizenId": { $ne: citizenId },
      },
      {
        $push: {
          readBy: { citizenId, readAt: new Date() },
        },
      },
      { new: true },
    );

    if (notice) {
      return res.status(200).json({
        status: true,
        message: "Notice marked as read.",
        isRead: true,
      });
    }

    const existing = await Notice.exists(filter);

    if (!existing) {
      return sendError(res, 404, "Notice not found.");
    }

    return res.status(200).json({
      status: true,
      message: "Notice was already read.",
      isRead: true,
    });
  } catch (error) {
    return handleError(res, error);
  }
};
