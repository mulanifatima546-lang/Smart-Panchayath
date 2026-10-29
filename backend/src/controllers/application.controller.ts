import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import applicationModel from "../models/application.model.js";

type UserRole = "citizen" | "operator" | "administrator";

type AuthenticatedRequest = Request & {
  user?: {
    id?: string;
    _id?: string;
    role?: UserRole;
  };
};

const ADMIN_ROLE: UserRole = "administrator";

const getUserId = (req: AuthenticatedRequest): string | undefined =>
  req.user?.id ?? req.user?._id;

const isValidObjectId = (id: unknown): id is string =>
  typeof id === "string" && mongoose.Types.ObjectId.isValid(id);

const isAdministrator = (req: AuthenticatedRequest): boolean =>
  req.user?.role === ADMIN_ROLE;

const generateApplicationNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.floor(1000 + Math.random() * 9000).toString();
  return `APP-${timestamp}-${random}`;
};

const serviceTypes = [
  "Birth Certificate",
  "Death Certificate",
  "Residence Certificate",
  "Income Certificate",
  "Caste Certificate",
  "Water Connection",
  "Complaint",
  "Other",
] as const;

const applicationStatuses = [
  "Pending",
  "Under Review",
  "More Information Required",
  "Approved",
  "Rejected",
] as const;

type ApplicationStatus = (typeof applicationStatuses)[number];

const isValidStatus = (status: unknown): status is ApplicationStatus =>
  typeof status === "string" &&
  applicationStatuses.includes(status as ApplicationStatus);

const isValidServiceType = (serviceType: unknown): boolean =>
  typeof serviceType === "string" &&
  serviceTypes.includes(serviceType as (typeof serviceTypes)[number]);

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const validateDocuments = (documents: unknown): string | null => {
  if (!Array.isArray(documents)) {
    return "Documents must be an array.";
  }

  for (const document of documents) {
    if (
      !isPlainObject(document) ||
      typeof document.name !== "string" ||
      !document.name.trim() ||
      typeof document.url !== "string" ||
      !document.url.trim()
    ) {
      return "Each document must have a name and URL.";
    }

    if (
      document.publicId !== undefined &&
      typeof document.publicId !== "string"
    ) {
      return "Document publicId must be a string.";
    }
  }

  return null;
};

const normalizeDocuments = (
  documents: Array<{
    name: string;
    url: string;
    publicId?: string;
  }>,
) =>
  documents.map((document) => ({
    name: document.name.trim(),
    url: document.url.trim(),
    ...(typeof document.publicId === "string" && document.publicId.trim()
      ? { publicId: document.publicId.trim() }
      : {}),
  }));

/**
 * CITIZEN: Create an application
 * POST /api/application
 */
export const createApplication = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const citizenId = getUserId(req);

    if (!isValidObjectId(citizenId)) {
      return res.status(401).json({
        status: false,
        message: "Authentication required.",
      });
    }

    const { panchayat, serviceType, applicantDetails } = req.body;
    const documents = req.body.documents ?? [];

    if (!isValidObjectId(panchayat)) {
      return res.status(400).json({
        status: false,
        message: "Valid panchayat ID is required.",
      });
    }

    if (!isValidServiceType(serviceType)) {
      return res.status(400).json({
        status: false,
        message: "Valid service type is required.",
      });
    }

    if (!isPlainObject(applicantDetails)) {
      return res.status(400).json({
        status: false,
        message: "Applicant details must be an object.",
      });
    }

    const documentError = validateDocuments(documents);

    if (documentError) {
      return res.status(400).json({
        status: false,
        message: documentError,
      });
    }

    const application = await applicationModel.create({
      applicationNumber: generateApplicationNumber(),
      citizen: citizenId,
      panchayat,
      serviceType,
      applicantDetails,
      documents: normalizeDocuments(documents),
      status: "Pending",
      submitedAt: new Date(),
    });

    return res.status(201).json({
      status: true,
      message: "Application submitted successfully.",
      application,
    });
  } catch (error) {
    console.error("Create application error:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return res.status(409).json({
        status: false,
        message: "Application number conflict. Please try again.",
      });
    }

    return res.status(500).json({
      status: false,
      message: "Failed to submit application.",
    });
  }
};

/**
 * CITIZEN: Get the logged-in citizen's applications
 * GET /api/application/my
 */
export const getMyApplications = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const citizenId = getUserId(req);

    if (!isValidObjectId(citizenId)) {
      return res.status(401).json({
        status: false,
        message: "Authentication required.",
      });
    }

    const applications = await applicationModel
      .find({ citizen: citizenId })
      .populate("panchayat", "name state district taluka village")
      .populate("citizen", "name email username")
      .populate("reviewedBy", "name email username")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      status: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get my applications error:", error);

    return res.status(500).json({
      status: false,
      message: "Failed to fetch applications.",
    });
  }
};

/**
 * CITIZEN: Get one of the logged-in citizen's applications
 * GET /api/application/:applicationId
 */
export const getApplicationById = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const citizenId = getUserId(req);
    const { applicationId } = req.params;

    if (!isValidObjectId(citizenId)) {
      return res.status(401).json({
        status: false,
        message: "Authentication required.",
      });
    }

    if (!isValidObjectId(applicationId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid application ID.",
      });
    }

    const application = await applicationModel
      .findOne({
        _id: applicationId,
        citizen: citizenId,
      })
      .populate("panchayat", "name state district taluka village address")
      .populate("citizen", "name email username")
      .populate("reviewedBy", "name email username")
      .lean();

    if (!application) {
      return res.status(404).json({
        status: false,
        message: "Application not found.",
      });
    }

    return res.status(200).json({
      status: true,
      application,
    });
  } catch (error) {
    console.error("Get application by ID error:", error);

    return res.status(500).json({
      status: false,
      message: "Failed to fetch application.",
    });
  }
};

/**
 * CITIZEN OR ADMINISTRATOR: Update an application
 * PATCH /api/application/:applicationId
 *
 * Citizens can edit their own pending applications.
 * Only administrators can change status.
 */
export const updateApplication = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = getUserId(req);
    const { applicationId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(401).json({
        status: false,
        message: "Authentication required.",
      });
    }

    if (!isValidObjectId(applicationId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid application ID.",
      });
    }

    const existingApplication = await applicationModel.findById(applicationId);

    if (!existingApplication) {
      return res.status(404).json({
        status: false,
        message: "Application not found.",
      });
    }

    const isCitizen = existingApplication.citizen.toString() === userId;

    const isAdmin = isAdministrator(req);

    if (!isCitizen && !isAdmin) {
      return res.status(403).json({
        status: false,
        message: "You are not authorized to update this application.",
      });
    }

    const { serviceType, applicantDetails, documents, status, remarks } =
      req.body;

    const updates: Record<string, unknown> = {};

    if (serviceType !== undefined) {
      if (!isValidServiceType(serviceType)) {
        return res.status(400).json({
          status: false,
          message: "Invalid service type.",
        });
      }

      updates.serviceType = serviceType;
    }

    if (applicantDetails !== undefined) {
      if (!isPlainObject(applicantDetails)) {
        return res.status(400).json({
          status: false,
          message: "Applicant details must be an object.",
        });
      }

      updates.applicantDetails = applicantDetails;
    }

    if (documents !== undefined) {
      const documentError = validateDocuments(documents);

      if (documentError) {
        return res.status(400).json({
          status: false,
          message: documentError,
        });
      }

      updates.documents = normalizeDocuments(documents);
    }

    if (status !== undefined) {
      if (!isAdmin) {
        return res.status(403).json({
          status: false,
          message: "Only an administrator can change application status.",
        });
      }

      if (!isValidStatus(status)) {
        return res.status(400).json({
          status: false,
          message:
            "Invalid status. Allowed values: Pending, Under Review, More Information Required, Approved, Rejected.",
        });
      }

      updates.status = status;
      updates.reviewedBy = new mongoose.Types.ObjectId(userId);
      updates.reviewedAt = new Date();
    }

    if (remarks !== undefined) {
      if (typeof remarks !== "string") {
        return res.status(400).json({
          status: false,
          message: "Remarks must be a string.",
        });
      }

      updates.remarks = remarks.trim();

      if (isAdmin) {
        updates.reviewedBy = new mongoose.Types.ObjectId(userId);
        updates.reviewedAt = new Date();
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: false,
        message: "No valid fields provided to update.",
      });
    }

    if (!isAdmin && existingApplication.status !== "Pending") {
      return res.status(400).json({
        status: false,
        message: "Only pending applications can be edited by the applicant.",
      });
    }

    const application = await applicationModel
      .findByIdAndUpdate(
        applicationId,
        { $set: updates },
        { new: true, runValidators: true },
      )
      .populate("panchayat", "name state district taluka village")
      .populate("citizen", "name email username")
      .populate("reviewedBy", "name email username");

    if (!application) {
      return res.status(404).json({
        status: false,
        message: "Application not found.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Application updated successfully.",
      application,
    });
  } catch (error) {
    console.error("Update application error:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      status: false,
      message: "Failed to update application.",
    });
  }
};

/**
 * ADMINISTRATOR: Get all applications
 * GET /api/application/admin
 */
export const getAllApplicationsAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    if (!isAdministrator(req)) {
      return res.status(403).json({
        status: false,
        message: "Administrator access required.",
      });
    }

    const page = Math.max(
      1,
      Number.parseInt(String(req.query.page ?? "1"), 10) || 1,
    );

    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(String(req.query.limit ?? "10"), 10) || 10),
    );

    const status =
      typeof req.query.status === "string" ? req.query.status : undefined;

    const panchayat =
      typeof req.query.panchayat === "string" ? req.query.panchayat : undefined;

    const filter: Record<string, unknown> = {};

    if (status && status.toLowerCase() !== "all") {
      if (!isValidStatus(status)) {
        return res.status(400).json({
          status: false,
          message: "Invalid application status filter.",
        });
      }

      filter.status = status;
    }

    if (panchayat) {
      if (!isValidObjectId(panchayat)) {
        return res.status(400).json({
          status: false,
          message: "Invalid panchayat ID.",
        });
      }

      filter.panchayat = panchayat;
    }

    const [applications, total] = await Promise.all([
      applicationModel
        .find(filter)
        .populate("citizen", "name email username address panchayat")
        .populate("panchayat", "name state district taluka village")
        .populate("reviewedBy", "name email username")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      applicationModel.countDocuments(filter),
    ]);

    return res.status(200).json({
      status: true,
      message: "Applications fetched successfully.",
      applications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Administrator get all applications error:", error);

    return res.status(500).json({
      status: false,
      message: "Failed to fetch applications.",
    });
  }
};

/**
 * ADMINISTRATOR: Get one application by ID
 * GET /api/application/admin/:applicationId
 */
export const getApplicationByIdAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    if (!isAdministrator(req)) {
      return res.status(403).json({
        status: false,
        message: "Administrator access required.",
      });
    }

    const { applicationId } = req.params;

    if (!isValidObjectId(applicationId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid application ID.",
      });
    }

    const application = await applicationModel
      .findById(applicationId)
      .populate("citizen", "name email username address panchayat")
      .populate("panchayat", "name state district taluka village address")
      .populate("reviewedBy", "name email username")
      .lean();

    if (!application) {
      return res.status(404).json({
        status: false,
        message: "Application not found.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Application fetched successfully.",
      application,
    });
  } catch (error) {
    console.error("Administrator get application by ID error:", error);

    return res.status(500).json({
      status: false,
      message: "Failed to fetch application.",
    });
  }
};

/**
 * ADMINISTRATOR: Update status and/or remarks
 * PATCH /api/application/admin/:applicationId/status
 */
export const updateApplicationStatusAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const adminId = getUserId(req);

    if (!isAdministrator(req)) {
      return res.status(403).json({
        status: false,
        message: "Administrator access required.",
      });
    }

    if (!isValidObjectId(adminId)) {
      return res.status(401).json({
        status: false,
        message: "Valid administrator authentication is required.",
      });
    }

    const { applicationId } = req.params;

    if (!isValidObjectId(applicationId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid application ID.",
      });
    }

    const { status, remarks } = req.body;

    const updates: {
      status?: ApplicationStatus;
      remarks?: string;
      reviewedBy?: mongoose.Types.ObjectId;
      reviewedAt?: Date;
    } = {};

    if (status !== undefined) {
      if (!isValidStatus(status)) {
        return res.status(400).json({
          status: false,
          message:
            "Invalid status. Allowed values: Pending, Under Review, More Information Required, Approved, Rejected.",
        });
      }

      updates.status = status;
    }

    if (remarks !== undefined) {
      if (typeof remarks !== "string") {
        return res.status(400).json({
          status: false,
          message: "Remarks must be a string.",
        });
      }

      updates.remarks = remarks.trim();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: false,
        message: "Provide a status or remarks to update.",
      });
    }

    updates.reviewedBy = new mongoose.Types.ObjectId(adminId);
    updates.reviewedAt = new Date();

    const application = await applicationModel
      .findByIdAndUpdate(
        applicationId,
        { $set: updates },
        { new: true, runValidators: true },
      )
      .populate("citizen", "name email username")
      .populate("panchayat", "name state district taluka village")
      .populate("reviewedBy", "name email username");

    if (!application) {
      return res.status(404).json({
        status: false,
        message: "Application not found.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Application status updated successfully.",
      application,
    });
  } catch (error) {
    console.error("Administrator update application status error:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        status: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      status: false,
      message: "Failed to update application status.",
    });
  }
};

/**
 * ADMINISTRATOR: Get application statistics
 * GET /api/application/admin/stats
 */
export const getApplicationStatsAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    if (!isAdministrator(req)) {
      return res.status(403).json({
        status: false,
        message: "Administrator access required.",
      });
    }

    const [total, groupedStatuses] = await Promise.all([
      applicationModel.countDocuments(),

      applicationModel.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const statusCounts: Record<string, number> = {
      Pending: 0,
      "Under Review": 0,
      "More Information Required": 0,
      Approved: 0,
      Rejected: 0,
    };

    for (const item of groupedStatuses) {
      if (typeof item._id === "string") {
        statusCounts[item._id] = item.count;
      }
    }

    return res.status(200).json({
      status: true,
      message: "Application statistics fetched successfully.",
      stats: {
        total,
        pending: statusCounts.Pending,
        underReview: statusCounts["Under Review"],
        moreInformationRequired: statusCounts["More Information Required"],
        approved: statusCounts.Approved,
        rejected: statusCounts.Rejected,
      },
    });
  } catch (error) {
    console.error("Administrator application statistics error:", error);

    return res.status(500).json({
      status: false,
      message: "Failed to fetch application statistics.",
    });
  }
};
