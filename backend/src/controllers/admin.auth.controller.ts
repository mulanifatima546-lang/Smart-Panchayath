import type { Request, Response } from "express";
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateSessionCode from "../config/sessioncode.js";

export const signInAdmin = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    const admin = await userModel
      .findOne({
        $or: [{ email: identifier }, { username: identifier }],
      })
      .select("+password");

    if (!admin || admin.role !== "administrator") {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const session_code = await generateSessionCode(admin._id.toString());

    res.cookie("session_code", session_code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Admin signed in successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
