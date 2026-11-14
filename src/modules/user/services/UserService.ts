import {
  ResultAsync,
  ResultBuilder,
  ResultUtil,
  type Result,
} from "../../../shared/results/Result.ts";
import { CreateUserServiceDTO } from "../dtos/UserServiceDTOs.ts";

export class UserService {
  public create(
    data: CreateUserServiceDTO,
  ): Promise<Result<CreateUserServiceDTO, string>> {
    return ResultBuilder.ok(data)
      .bind(this.x)
      .asynchronous()
      .bind(this.y)
      .bind(this.y)
      .bind(this.w)
      .bindSync(this.x)
      .bind(this.w)
      .finish();
  }

  private x(data: CreateUserServiceDTO): Result<CreateUserServiceDTO, string> {
    return ResultBuilder.ok(data);
  }

  private async y(
    data: CreateUserServiceDTO,
  ): Promise<Result<CreateUserServiceDTO, string>> {
    return new Promise((resolve, _) =>
      setTimeout(() => {
        resolve(ResultBuilder.ok(data));
      }, 1000),
    );
  }

  private async w(
    data: CreateUserServiceDTO,
  ): Promise<Result<CreateUserServiceDTO, string>> {
    return new Promise((resolve, _) =>
      setTimeout(() => {
        resolve(ResultBuilder.ok(data));
      }, 1000),
    );
  }
  public firstMessage() {
    return { message: "First user output!" };
  }
}
