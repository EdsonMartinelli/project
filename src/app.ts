import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { userRouter } from "./routes/user.routes.ts";
import { healthRouter } from "./routes/health.routes.ts";

export const app: Express = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/user", userRouter);
app.use("/health-check", healthRouter);
