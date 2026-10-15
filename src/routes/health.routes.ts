import { Router, type Request, type Response } from "express";

export const healthRouter: Router = Router();

healthRouter.get("/", (req: Request, res: Response) => {
  res.json({ message: "health check passed!" });
});
