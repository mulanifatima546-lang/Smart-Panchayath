import type { Request, Response } from "express";
import mongoose from "mongoose";
import applicationModel from "../models/application.model.js";

type AuthenticatedRequest = Request & {
  user?: {
    id?: string;
    _id?: string;
  };
};

const getUserId = (req: AuthenticatedRequest): string | undefined => {
  return req.user?.id ?? req.user?._id;
};

const isValidObjectId = (id: unknown): id is string => {
  return typeof id === "string" && mongoose.Types.ObjectId.isValid(id);
};

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

    const {
      panchayat,
      serviceType,
      applicantDetails,
      documents = [],
    } = req.body;

    if (!isValidObjectId(panchayat)) {
      return res.status(400).json({
        status: false,
        message: "Valid panchayat ID is required.",
      });
    }

    if (
      typeof serviceType !== "string" ||
      !serviceTypes.includes(serviceType as (typeof serviceTypes)[number])
    ) {
      return res.status(400).json({
        status: false,
        message: "Valid service type is required.",
      });
    }

    if (
      !applicantDetails ||
      typeof applicantDetails !== "object" ||
      Array.isArray(applicantDetails)
    ) {
      return res.status(400).json({
        status: false,
        message: "Applicant details must be an object.",
      });
    }

    if (!Array.isArray(documents)) {
      return res.status(400).json({
        status: false,
        message: "Documents must be an array.",
      });
    }

    for (const document of documents) {
      if (
        !document ||
        typeof document.name !== "string" ||
        !document.name.trim() ||
        typeof document.url !== "string" ||
        !document.url.trim()
      ) {
        return res.status(400).json({
          status: false,
          message: "Each document must have a name and URL.",
        });
      }
    }

    const application = await applicationModel.create({
      applicationNumber: generateApplicationNumber(),
      citizen: citizenId,
      panchayat,
      serviceType: serviceType as (typeof serviceTypes)[number],
      applicantDetails,
      documents: documents.map(
        (document: { name: string; url: string; publicId?: string }) => ({
          name: document.name.trim(),
          url: document.url.trim(),
          ...(typeof document.publicId === "string" && document.publicId.trim()
            ? { publicId: document.publicId.trim() }
            : {}),
        }),
      ),
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
      .populate("citizen", "name email")
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
      .populate("citizen", "name email")
      .populate("reviewedBy", "name email")
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

    const isAdmin =
      req.user && (req.user as Record<string, unknown>).role === "admin";

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
      if (
        typeof serviceType !== "string" ||
        !serviceTypes.includes(serviceType as (typeof serviceTypes)[number])
      ) {
        return res.status(400).json({
          status: false,
          message: "Invalid service type.",
        });
      }

      updates.serviceType = serviceType;
    }

    if (applicantDetails !== undefined) {
      if (
        !applicantDetails ||
        typeof applicantDetails !== "object" ||
        Array.isArray(applicantDetails)
      ) {
        return res.status(400).json({
          status: false,
          message: "Applicant details must be an object.",
        });
      }

      updates.applicantDetails = applicantDetails;
    }

    if (documents !== undefined) {
      if (!Array.isArray(documents)) {
        return res.status(400).json({
          status: false,
          message: "Documents must be an array.",
        });
      }

      for (const document of documents) {
        if (
          !document ||
          typeof document.name !== "string" ||
          !document.name.trim() ||
          typeof document.url !== "string" ||
          !document.url.trim()
        ) {
          return res.status(400).json({
            status: false,
            message: "Each document must have a name and URL.",
          });
        }
      }

      updates.documents = documents.map(
        (document: { name: string; url: string; publicId?: string }) => ({
          name: document.name.trim(),
          url: document.url.trim(),
          ...(typeof document.publicId === "string" && document.publicId.trim()
            ? { publicId: document.publicId.trim() }
            : {}),
        }),
      );
    }

    if (status !== undefined) {
      if (
        !isAdmin ||
        typeof status !== "string" ||
        !applicationStatuses.includes(
          status as (typeof applicationStatuses)[number],
        )
      ) {
        return res.status(403).json({
          status: false,
          message: "Only an admin can set a valid application status.",
        });
      }

      updates.status = status;
      updates.reviewedBy = userId;
      updates.reviewedAt = new Date();
    }

    if (remarks !== undefined) {
      if (typeof remarks !== "string") {
        return res.status(400).json({
          status: false,
          message: "Remarks must be a string.",
        });
      }

      if (!isAdmin && !isCitizen) {
        return res.status(403).json({
          status: false,
          message: "You are not authorized to update remarks.",
        });
      }

      updates.remarks = remarks.trim();
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
      .populate("citizen", "name email")
      .populate("reviewedBy", "name email");

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
