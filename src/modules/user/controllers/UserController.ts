import { ResultBuilder } from "../../../shared/results/Result.ts";
import { CreateUserServiceDTO } from "../dtos/UserServiceDTOs.ts";
import type { UserErrorKind } from "../errors/UserError.ts";
import { CreateUserService } from "../services/CreateUserService.ts";
import { type Request, type Response } from "express";

const userErrorStatusMap: Record<UserErrorKind, number> = {
  INTERNAL: 500,
  DUPLICATED_USER: 409,
  INVALID_FIELDS: 400,
};

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
        res.status(201).json(data);
      },
      onFailure: (er) => {
        res.status(userErrorStatusMap[er.kind]).json(er.message);
      },
    });
  }
}
