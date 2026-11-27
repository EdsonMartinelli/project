import z from "zod";
import { ResultBuilder, type Result } from "../../../shared/results/Result.ts";
import { UserConstraints } from "../constraints/UserConstraints.ts";
import { InvalidFieldsUser, type UserError } from "../errors/UserError.ts";

const createUserSchema = z.strictObject({
  email: z.email(),
  password: z
    .string()
    .max(UserConstraints.USERNAME_MAX_LENGTH)
    .min(UserConstraints.USERNAME_MIN_LENGTH),
  username: z
    .string()
    .min(UserConstraints.USERNAME_MIN_LENGTH)
    .max(UserConstraints.USERNAME_MAX_LENGTH),
});

export class CreateUserServiceDTO {
  public readonly email: string;
  public readonly password: string;
  public readonly username: string;

  private constructor(data: {
    email: string;
    password: string;
    username: string;
  }) {
    this.email = data.email;
    this.password = data.password;
    this.username = data.username;
  }

  static create(
    data: Record<string, string>,
  ): Result<CreateUserServiceDTO, UserError> {
    const result = createUserSchema.safeParse(data);
    if (!result.success) return ResultBuilder.fail(new InvalidFieldsUser());
    return ResultBuilder.ok(new CreateUserServiceDTO(result.data));
  }
}

export class UserServiceDTO {
  public readonly id: string;
  public readonly email: string;
  public readonly password: string;
  public readonly username: string;

  private constructor(data: {
    id: string;
    email: string;
    password: string;
    username: string;
  }) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.username = data.username;
  }

  static create(data: UserServiceDTO): UserServiceDTO {
    return new UserServiceDTO(data);
  }
}
