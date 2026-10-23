import { UserService } from "../services/user/UserService.ts";
import { type Request, type Response } from "express";
import { ResultBuilder } from "../shared/Result.ts";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public async getMessage(req: Request, res: Response) {
    const data = {
      email: "test@test.com",
      password: "1234",
    };
    const x = await this.userService.create(data);
    ResultBuilder.unwrap(x, {
      onSuccess: (data) => {
        res.json(data);
      },
      onFailure: (er) => {
        res.json(er);
      },
    });
  }
}
