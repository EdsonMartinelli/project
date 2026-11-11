import z from "zod";
import { ResultBuilder, type Result } from "../../../shared/results/Result.ts";

const createUserSchema = z.strictObject({
  email: z.email(),
  password: z.string().max(30),
  name: z.string(),
});

export class CreateUserServiceDTO {
  public readonly email: string;
  public readonly password: string;
  public readonly name: string;

  private constructor(data: { email: string; password: string; name: string }) {
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
  }

  static create(
    data: Record<string, string>,
  ): Result<CreateUserServiceDTO, string> {
    const result = createUserSchema.safeParse(data);
    if (!result.success) return ResultBuilder.fail("field errors");
    return ResultBuilder.ok(new CreateUserServiceDTO(result.data));
  }
}
