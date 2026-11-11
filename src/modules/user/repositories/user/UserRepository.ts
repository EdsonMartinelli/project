import { database } from "../../../../config/DatabaseConfig.ts";
import { usersTable } from "../../../../database/schema.ts";
import {
  ResultBuilder,
  type Result,
} from "../../../../shared/results/Result.ts";
import type { CreateUserRepositoryDTO } from "./entities/CreateUserRepositoryDTO.ts";
import type { IUserRepository } from "./IUserRepository.ts";

export class UserRepository implements IUserRepository {
  createUser(
    user: CreateUserRepositoryDTO,
  ): Result<CreateUserRepositoryDTO, string> {
    try {
      const x = database.insert(usersTable).values(user);
      return ResultBuilder.ok(user);
    } catch (e: unknown) {
      return ResultBuilder.fail("database error");
    }
  }
}
