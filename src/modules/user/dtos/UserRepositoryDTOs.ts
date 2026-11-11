import z from "zod";
import { ResultBuilder, type Result } from "../../../shared/results/Result.ts";

const userRepository = z.strictObject({
  email: z.email(),
  password: z.string().max(30),
  name: z.string(),
});

export class CreateUserRepositoryDTO {
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
  ): Result<CreateUserRepositoryDTO, string> {
    const result = userRepository.safeParse(data);
    if (!result.success) return ResultBuilder.fail("field errors");
    return ResultBuilder.ok(new CreateUserRepositoryDTO(result.data));
  }
}
