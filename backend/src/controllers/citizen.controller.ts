import type { Request, Response } from "express";
import mongoose from "mongoose";
import userModel from "../models/user.model.js";
import applicationModel from "../models/application.model.js";
import panchayatModel from "../models/panchayat.model.js";

type AuthenticatedRequest = Request & {
  user?: {
    id?: string;
    _id?: string;
    role?: string;
  };
};

export const getCitizenDashboard = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const citizenId = req.user?.id ?? req.user?._id;

    if (!citizenId || !mongoose.Types.ObjectId.isValid(citizenId)) {
      return res.status(401).json({
        status: false,
        message: "Authentication required.",
      });
    }

    const citizen = await userModel
      .findById(citizenId)
      .select("name email username role address panchayat isVerified createdAt")
      .lean();

    if (!citizen) {
      return res.status(404).json({
        status: false,
        message: "Citizen not found.",
      });
    }

    if (citizen.role !== "citizen") {
      return res.status(403).json({
        status: false,
        message: "This dashboard is available to citizens only.",
      });
    }

    const applicationFilter = {
      citizen: new mongoose.Types.ObjectId(citizenId),
    };

    const [
      total,
      pending,
      underReview,
      approved,
      rejected,
      moreInformationRequired,
      recentApplications,
      panchayat,
    ] = await Promise.all([
      applicationModel.countDocuments(applicationFilter),
      applicationModel.countDocuments({
        ...applicationFilter,
        status: "Pending",
      }),
      applicationModel.countDocuments({
        ...applicationFilter,
        status: "Under Review",
      }),
      applicationModel.countDocuments({
        ...applicationFilter,
        status: "Approved",
      }),
      applicationModel.countDocuments({
        ...applicationFilter,
        status: "Rejected",
      }),
      applicationModel.countDocuments({
        ...applicationFilter,
        status: "More Information Required",
      }),
      applicationModel
        .find(applicationFilter)
        .select(
          "applicationNumber serviceType status submitedAt createdAt updatedAt remarks",
        )
        .populate("panchayat", "name village district state")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      citizen.panchayat
        ? panchayatModel
            .findById(citizen.panchayat)
            .select(
              "name state district taluka village address contactNumber email sarpanch",
            )
            .lean()
        : Promise.resolve(null),
    ]);

    return res.status(200).json({
      status: true,
      citizen: {
        _id: citizen._id,
        name: citizen.name,
        email: citizen.email,
        username: citizen.username,
        address: citizen.address,
        isVerified: citizen.isVerified,
        createdAt: citizen.createdAt,
      },
      panchayat,
      summary: {
        total,
        pending,
        underReview,
        approved,
        rejected,
        moreInformationRequired,
      },
      recentApplications,
      notifications: [],
      announcements: [],
    });
  } catch (error) {
    console.error("Get citizen dashboard error:", error);

    return res.status(500).json({
      status: false,
      message: "Failed to load citizen dashboard.",
    });
  }
};
