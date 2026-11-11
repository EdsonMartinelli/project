import { database } from "../../../config/DatabaseConfig.ts";
import { usersTable } from "../../../database/schema.ts";
import { ResultBuilder, type Result } from "../../../shared/results/Result.ts";
import type { CreateUserRepositoryDTO } from "../dtos/UserRepositoryDTOs.ts";
import type { IUserRepository } from "./IUserRepository.ts";

export class UserRepository implements IUserRepository {
  async createUser(
    user: CreateUserRepositoryDTO,
  ): Promise<Result<CreateUserRepositoryDTO, string>> {
    try {
      await database.insert(usersTable).values(user);
      return ResultBuilder.ok(user);
    } catch (e: unknown) {
      return ResultBuilder.fail("database error");
    }
  }
}
