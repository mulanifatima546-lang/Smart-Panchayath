import { Types } from "mongoose";

declare global {
  namespace Express {
    interface User {
      _id: Types.ObjectId;
      id?: string;
      role: "citizen" | "operator" | "administrator";
      panchayatId?:
        | Types.ObjectId
        | string
        | {
            _id: Types.ObjectId | string;
          }
        | null;
      panchayat?:
        | Types.ObjectId
        | string
        | {
            _id: Types.ObjectId | string;
          }
        | null;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
