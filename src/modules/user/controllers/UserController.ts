import { ResultBuilder } from "../../../shared/results/Result.ts";
import { CreateUserServiceDTO } from "../services/entities/CreateUserServiceDTO.ts";
import { UserService } from "../services/UserService.ts";
import { type Request, type Response } from "express";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public async getMessage(req: Request, res: Response) {
    const result = await CreateUserServiceDTO.create(req.body).bindAsync(
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
