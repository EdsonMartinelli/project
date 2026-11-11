import type { Result } from "../../../../shared/results/Result.ts";
import type { CreateUserRepositoryDTO } from "./entities/CreateUserRepositoryDTO.ts";

export interface IUserRepository {
  createUser: (
    user: CreateUserRepositoryDTO,
  ) => Result<CreateUserRepositoryDTO, string>;
}
