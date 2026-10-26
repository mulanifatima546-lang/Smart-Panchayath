import type { Request, Response } from "express";
import panchayatModel from "../models/panchayat.model.js";
import userModel from "../models/user.model.js";

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
