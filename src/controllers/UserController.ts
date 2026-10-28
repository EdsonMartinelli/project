import { UserService } from "../services/user/UserService.ts";
import { type Request, type Response } from "express";
import { ResultBuilder } from "../shared/Result.ts";
import { CreateUserDTO } from "../services/user/entities/CreateUserDTO.ts";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public async getMessage(req: Request, res: Response) {
    const result = await CreateUserDTO.create(req.body).bindAsync(
      this.userService.create.bind(this.userService),
    );
    ResultBuilder.unwrap(result, {
      onSuccess: (data) => {
        res.json(data);
      },
      onFailure: (er) => {
        res.json(er);
      },
    });
  }
}
