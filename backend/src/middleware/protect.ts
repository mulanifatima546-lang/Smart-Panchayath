import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

declare global {
  namespace Express {
    interface Request {
      user?: Awaited<ReturnType<typeof userModel.findById>>;
    }
  }
}

const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const session_code = req.cookies?.session_code;

    if (!session_code) {
      res.status(401).json({
        authenticated: false,
        message: "Not authorized, please sign in",
      });
      return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET is not configured");

      res.status(500).json({
        message: "Internal server configuration error",
      });
      return;
    }

    const decoded = jwt.verify(session_code, secret) as {
      userId: string;
    };

    const user = await userModel.findById(decoded.userId);

    if (!user) {
      res.status(401).json({
        authenticated: false,
        message: "Not authorized, user not found",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      authenticated: false,
      message: "Not authorized, session invalid or expired",
    });
  }
};

export default protect;
