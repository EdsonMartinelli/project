import { Router, type Request, type Response } from "express";
import { UserControllerFactory } from "../modules/user/factories/UserControllerFactory.ts";
import type { UserController } from "../modules/user/controllers/UserController.ts";

export const userRouter: Router = Router();

const userController: UserController =
  new UserControllerFactory().getController();

userRouter.post("/", (req: Request, res: Response) => {
  userController.getMessage(req, res);
});
