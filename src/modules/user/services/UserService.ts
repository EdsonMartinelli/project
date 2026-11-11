import { ResultBuilder, type Result } from "../../../shared/results/Result.ts";
import type { CreateUserServiceDTO } from "../dtos/UserServiceDTOs.ts";

export class UserService {
  public async create(
    data: CreateUserServiceDTO,
  ): Promise<Result<CreateUserServiceDTO, string>> {
    const j = await ResultBuilder.ok(data).bind(this.x).bindAsync(this.y);
    return await j.bindAsync(this.w);
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
