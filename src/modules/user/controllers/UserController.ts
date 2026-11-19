import { ResultBuilder } from "../../../shared/results/Result.ts";
import { CreateUserServiceDTO } from "../dtos/UserServiceDTOs.ts";
import { CreateUserService } from "../services/CreateUserService.ts";
import { type Request, type Response } from "express";

export class UserController {
  private createUserService: CreateUserService;

  constructor(createUserService: CreateUserService) {
    this.createUserService = createUserService;
  }

  public async createUser(req: Request, res: Response) {
    const result = CreateUserServiceDTO.create(req.body)
      .asynchronous()
      .bind(this.createUserService.create.bind(this.createUserService));

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
