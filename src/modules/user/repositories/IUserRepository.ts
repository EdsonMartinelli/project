import type { Result } from "../../../shared/results/Result.ts";
import type { UserRepositoryDTO } from "../dtos/UserRepositoryDTOs.ts";
import type { UserError } from "../errors/UserError.ts";

export interface IUserRepository {
  createUser: (
    user: UserRepositoryDTO,
  ) => Promise<Result<UserRepositoryDTO, UserError>>;
}
