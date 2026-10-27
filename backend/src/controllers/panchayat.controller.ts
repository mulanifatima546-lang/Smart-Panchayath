import type { Request, Response } from "express";
import panchayatModel from "../models/panchayat.model.js";
import userModel from "../models/user.model.js";
import { log } from "node:console";
import mongoose from "mongoose";

export const createNewPanchayat = async (req: Request, res: Response) => {
  try {
    const {
      name,
      state,
      district,
      taluka,
      village,
      address,
      contactNumber,
      email,
      sarpanch,
    } = req.body;

    console.log(req.body);

    const adminId = req.user;

    const admin = await userModel.findById(adminId);

    if (!admin) {
      return res.status(401).json({
        message: "No admin exists",
        status: false,
      });
    }

    if (admin.role !== "administrator") {
      return res.status(401).json({
        message: "Only admins can add panchayats.",
        status: false,
      });
    }

    const panchayat = await panchayatModel.create({
      name,
      state,
      district,
      taluka,
      village,
      address,
      contactNumber,
      email,
      sarpanch,
    });

    res.status(201).json({
      message: "New Panchayat added.",
      status: true,
    });
  } catch (error) {
    console.log(error);

    res.status(401).json({
      message: "Something went wrong.",
      status: false,
    });
  }
};

export const getAllPanchatats = async (req: Request, res: Response) => {
  try {
    const panchayats = await panchayatModel.find();

    res.status(201).json({
      status: true,
      panchayats,
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({
      message: "Something went wrong",
      status: false,
    });
  }
};

export const getPanchayatById = async (req: Request, res: Response) => {
  try {
    const panchayatId = req.params.panchayatId;

    const panchayat = await panchayatModel.findById(panchayatId);

    if (!panchayat) {
      return res.status(404).json({
        message: "Invalid panchayat id.",
        status: false,
      });
    }

    res.status(201).json({
      status: true,
      panchayat,
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({
      message: "Something went wrong",
      status: false,
    });
  }
};
export const updatePanchayat = async (req: Request, res: Response) => {
  try {
    const { panchayatId } = req.params;

    console.log("UPDATE PANCHAYAT ID:", panchayatId);
    console.log("UPDATE PANCHAYAT BODY:", req.body);

    if (
      typeof panchayatId !== "string" ||
      !mongoose.Types.ObjectId.isValid(panchayatId)
    ) {
      return res.status(400).json({
        status: false,
        message: "Invalid Panchayat ID.",
      });
    }

    const allowedFields = [
      "name",
      "state",
      "district",
      "taluka",
      "village",
      "address",
      "contactNumber",
      "email",
      "sarpanch",
    ] as const;

    const updates: Record<string, string> = {};

    for (const field of allowedFields) {
      const value = req.body?.[field];

      if (value !== undefined) {
        if (typeof value !== "string") {
          return res.status(400).json({
            status: false,
            message: `${field} must be a string.`,
          });
        }

        updates[field] = value.trim();
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: false,
        message: "No valid fields provided.",
      });
    }

    const updatedPanchayat = await panchayatModel.findByIdAndUpdate(
      panchayatId,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedPanchayat) {
      return res.status(404).json({
        status: false,
        message: "Panchayat not found.",
      });
    }

    const savedPanchayat = await panchayatModel.findById(panchayatId).lean();

    console.log("UPDATED DOCUMENT:", updatedPanchayat);
    console.log("DOCUMENT READ BACK FROM DATABASE:", savedPanchayat);

    return res.status(200).json({
      status: true,
      message: "Panchayat updated successfully.",
      panchayat: savedPanchayat,
    });
  } catch (error) {
    console.error("UPDATE PANCHAYAT ERROR:", error);

    return res.status(500).json({
      status: false,
      message:
        error instanceof Error
          ? error.message
          : "Internal server error while updating Panchayat.",
    });
  }
};
