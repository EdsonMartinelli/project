import { ResultBuilder } from "../../../shared/results/Result.ts";
import { CreateUserServiceDTO } from "../dtos/UserServiceDTOs.ts";
import { UserService } from "../services/UserService.ts";
import { type Request, type Response } from "express";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public async getMessage(req: Request, res: Response) {
    const result = CreateUserServiceDTO.create(req.body)
      .asynchronous()
      .bind(this.userService.create.bind(this.userService));

    await ResultBuilder.unwrapAsync(result, {
      onSuccess: (data) => {
        res.json(data);
      },
      onFailure: (er) => {
        res.json(er);
      },
    });
  }
}
