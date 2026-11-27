import { DrizzleQueryError } from "drizzle-orm";
import { database } from "../../../config/DatabaseConfig.ts";
import { usersTable } from "../../../database/schema.ts";
import { ResultBuilder, type Result } from "../../../shared/results/Result.ts";
import { UserRepositoryDTO } from "../dtos/UserRepositoryDTOs.ts";
import type { IUserRepository } from "./IUserRepository.ts";
import { DatabaseError } from "pg";
import { PGConstraints } from "../../../database/constraints/PGConstraints.ts";
import {
  DuplicatedUser,
  InternalError,
  type UserError,
} from "../errors/UserError.ts";

export class UserRepository implements IUserRepository {
  async createUser(
    user: UserRepositoryDTO,
  ): Promise<Result<UserRepositoryDTO, UserError>> {
    try {
      await database.insert(usersTable).values(user);
      return ResultBuilder.ok(user);
    } catch (e: unknown) {
      if (
        e instanceof DrizzleQueryError &&
        e.cause instanceof DatabaseError &&
        e.cause.code === PGConstraints.PG_UNIQUE_VIOLATION
      ) {
        return ResultBuilder.fail(new DuplicatedUser());
      }

      return ResultBuilder.fail(new InternalError());
    }
  }
}
