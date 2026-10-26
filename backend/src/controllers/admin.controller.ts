import type { Request, Response } from "express";
import userModel from "../models/user.model.js";

export const getAdmin = async (req: Request, res: Response) => {
  try {
    const userId = (req as Request & { user: string }).user;

    const admin = await userModel.findById(userId);

    if (!admin || admin.role !== "administrator") {
      return res.status(401).json({
        message: "You're not admin here.",
        status: false,
      });
    }

    res.status(201).json({
      status: false,
      admin,
    });
  } catch (error) {
    res.status(401).json({
      status: false,
      message: "Something went wrong.",
    });
  }
};
