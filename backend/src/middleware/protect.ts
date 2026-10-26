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

const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session_code = req.cookies.session_code;

    if (!session_code) {
      return res.status(401).redirect("http://localhost:3000");
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return;
    }

    const decode = jwt.verify(session_code, secret) as {
      userId: string;
      iat: number;
      exp: number;
    };

    const user = await userModel.findById(decode.userId);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, session failed" });
  }
};

export default protect;
