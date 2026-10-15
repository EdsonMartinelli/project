import { Router, type Request, type Response } from "express";
import { UserControllerFactory } from "../factories/UserControllerFactory.ts";
import type { UserController } from "../controllers/UserController.ts";

export const userRouter: Router = Router();

const userController: UserController =
  new UserControllerFactory().getController();

userRouter.get("/", (req: Request, res: Response) => {
  userController.getMessage(req, res);
});
