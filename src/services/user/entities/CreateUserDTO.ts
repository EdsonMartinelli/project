import z from "zod";
import { ResultBuilder, type Result } from "../../../shared/Result.ts";

const user = z.strictObject({
  email: z.email(),
  password: z.string().max(30),
  name: z.string(),
});

export class CreateUserDTO {
  public readonly email: string;
  public readonly password: string;
  public readonly name: string;

  private constructor(data: { email: string; password: string; name: string }) {
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
  }

  static create(data: Record<string, string>): Result<CreateUserDTO, string> {
    const result = user.safeParse(data);
    if (!result.success) return ResultBuilder.fail("field errors");
    return ResultBuilder.ok(new CreateUserDTO(result.data));
  }
}
