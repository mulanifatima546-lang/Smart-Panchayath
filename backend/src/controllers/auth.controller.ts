import type { Request, Response } from "express";
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateSessionCode from "../config/sessioncode.js";

export const signIn = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;

    const user = await userModel
      .findOne({
        $or: [{ username: identifier }, { email: identifier }],
      })
      .select("+password");

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        status: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid password",
        status: false,
      });
    }

    const session_code = generateSessionCode(user._id.toString());

    res.cookie("session_code", session_code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(200).json({
      message: "Sign in successful",
      status: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      status: false,
    });
  }
};
export const signUp = async (req: Request, res: Response) => {
  try {
    console.log(req.body);

    const { name, username, email, password, address } = req.body;

    const user = await userModel.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (user?.username === username) {
      return res.status(400).json({
        message: "Username already exists",
        status: false,
      });
    }

    if (user?.email === email) {
      return res.status(400).json({
        message: "Email already exists",
        status: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const isAdmin =
      email === process.env.ADMIN_EMAIL &&
      username === process.env.ADMIN_USERNAME;

    const newUser = new userModel({
      name,
      username,
      email,
      password: hashedPassword,
      role: isAdmin ? "administrator" : "citizen",
      address,
    });

    await newUser.save();

    const session_code = generateSessionCode(newUser._id.toString());

    res.cookie("session_code", session_code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(201).json({
      message: "User created successfully",
      status: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      status: false,
    });
  }
};
