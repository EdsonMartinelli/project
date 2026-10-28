import { ResultBuilder, type Result } from "../../shared/Result.ts";
export type userInfo = {
  email: string;
  password: string;
};
export class UserService {
  public async create(data: userInfo): Promise<Result<userInfo, number>> {
    const x = await ResultBuilder.ok(data).bind(this.x).bindAsync(this.y);
    return await x.bindAsync(this.w);
  }

  private x(data: userInfo): Result<userInfo, number> {
    return ResultBuilder.ok(data);
  }

  private async y(data: userInfo): Promise<Result<userInfo, number>> {
    return new Promise((resolve, _) =>
      setTimeout(() => {
        resolve(ResultBuilder.ok(data));
      }, 1000),
    );
  }

  private async w(data: userInfo): Promise<Result<userInfo, number>> {
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
