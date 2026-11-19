import { database } from "../../../config/DatabaseConfig.ts";
import { usersTable } from "../../../database/schema.ts";
import { ResultBuilder, type Result } from "../../../shared/results/Result.ts";
import { UserRepositoryDTO } from "../dtos/UserRepositoryDTOs.ts";
import type { IUserRepository } from "./IUserRepository.ts";

export class UserRepository implements IUserRepository {
  async createUser(
    user: UserRepositoryDTO,
  ): Promise<Result<UserRepositoryDTO, string>> {
    try {
      await database.insert(usersTable).values(user);
      return ResultBuilder.ok(user);
    } catch (e: unknown) {
      return ResultBuilder.fail("Can't create user!");
    }
  }
}
