import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import connectDB from "./config/db.connection.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());

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
