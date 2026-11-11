import type { Result } from "../../../shared/results/Result.ts";
import type { CreateUserRepositoryDTO } from "../dtos/UserRepositoryDTOs.ts";

export interface IUserRepository {
  createUser: (
    user: CreateUserRepositoryDTO,
  ) => Promise<Result<CreateUserRepositoryDTO, string>>;
}
