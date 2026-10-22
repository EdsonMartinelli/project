import type { DomainError } from "../../shared/DomainError.ts";
import { ResultBuilder, type Result } from "../../shared/Result.ts";
type userInfo = {
  email: string;
  password: string;
};
export class UserService {
  public create(data: userInfo): Result<userInfo, DomainError> {
    return ResultBuilder.ok(data);
  }
  public firstMessage() {
    return { message: "First user output!" };
  }
}
