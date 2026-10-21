import { UserService } from "../services/user/UserService.ts";
import { type Request, type Response } from "express";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public getMessage(req: Request, res: Response) {
    const message = this.userService.firstMessage();
    res.json(message);
  }
}
