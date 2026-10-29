import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import connectDB from "./config/db.connection.js";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 3000;

app.set("trust proxy", 1);
app.use(
  cors({
    origin: [
      "https://smart-panchayath.vercel.app",
      "https://adminsmart-panchayath.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api", (await import("./router/router.js")).default);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    message: "404 route not found",
    status: false,
  });
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
