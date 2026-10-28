import { ResultBuilder, type Result } from "../../shared/Result.ts";
import type { CreateUserDTO } from "./entities/CreateUserDTO.ts";

export class UserService {
  public async create(
    data: CreateUserDTO,
  ): Promise<Result<CreateUserDTO, string>> {
    const j = await ResultBuilder.ok(data).bind(this.x).bindAsync(this.y);
    return await j.bindAsync(this.w);
  }

  private x(data: CreateUserDTO): Result<CreateUserDTO, string> {
    return ResultBuilder.ok(data);
  }

  private async y(data: CreateUserDTO): Promise<Result<CreateUserDTO, string>> {
    return new Promise((resolve, _) =>
      setTimeout(() => {
        resolve(ResultBuilder.ok(data));
      }, 1000),
    );
  }

  private async w(data: CreateUserDTO): Promise<Result<CreateUserDTO, string>> {
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
