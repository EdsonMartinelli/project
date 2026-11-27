import { describe, expect, it } from "@jest/globals";
import { CreateUserService } from "./CreateUserService.ts";
import {
  Failure,
  ResultBuilder,
  Success,
  type Result,
} from "../../../shared/results/Result.ts";
import type {
  CreateUserServiceDTO,
  UserServiceDTO,
} from "../dtos/UserServiceDTOs.ts";
import type { IUserRepository } from "../repositories/IUserRepository.ts";
import { UserRepositoryDTO } from "../dtos/UserRepositoryDTOs.ts";
import { randomUUID } from "node:crypto";
import { type IHasher } from "../../../shared/hash/Hasher.ts";
import { DuplicatedUser, type UserError } from "../errors/UserError.ts";

class FakeUserRepository implements IUserRepository {
  private db: UserRepositoryDTO[] = [
    {
      id: randomUUID(),
      email: "fail@fail.com",
      password: "1234678910",
      username: "test",
    },
  ];

  createUser(
    data: UserRepositoryDTO,
  ): Promise<Result<UserRepositoryDTO, UserError>> {
    const alreadyUsed = this.db.some((d) => {
      if (d.email == data.email) {
        return true;
      }
      return false;
    });
    if (alreadyUsed) {
      return Promise.resolve(ResultBuilder.fail(new DuplicatedUser()));
    }
    this.db.push(data);
    return Promise.resolve(ResultBuilder.ok(data));
  }
}

class FakeHasher implements IHasher {
  async hash(value: string): Promise<Result<string, string>> {
    return Promise.resolve(new Success(value));
  }
  async compare(value: string, hash: string): Promise<Result<boolean, string>> {
    return Promise.resolve(new Success(true));
  }
}

describe("UserService test", () => {
  it("should return success when user is created", async () => {
    const userService = new CreateUserService(
      new FakeUserRepository(),
      new FakeHasher(),
    );
    const data: CreateUserServiceDTO = {
      email: "success@success.com",
      password: "12345678910",
      username: "test",
    };
    const result = await userService.create(data);
    expect(result).toBeInstanceOf(Success);
  });

  it("should return failure when user is already created", async () => {
    const userService = new CreateUserService(
      new FakeUserRepository(),
      new FakeHasher(),
    );
    const data: CreateUserServiceDTO = {
      email: "fail@fail.com",
      password: "12345678910",
      username: "test",
    };
    const secondResult = await userService.create(data);
    expect(secondResult).toBeInstanceOf(Failure);

    const resultErrorCode = ResultBuilder.unwrap(secondResult, {
      onSuccess: function (data: UserServiceDTO) {
        return "fail in test";
      },
      onFailure: function (error: UserError) {
        return error.kind;
      },
    });

    expect(resultErrorCode).toBe("DUPLICATED_USER");
  });
});
