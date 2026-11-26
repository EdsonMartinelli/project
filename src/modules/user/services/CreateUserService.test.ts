import { describe, expect, it } from "@jest/globals";
import { CreateUserService } from "./CreateUserService.ts";
import {
  Failure,
  ResultBuilder,
  Success,
  type Result,
} from "../../../shared/results/Result.ts";
import type { CreateUserServiceDTO } from "../dtos/UserServiceDTOs.ts";
import type { IUserRepository } from "../repositories/IUserRepository.ts";
import { UserRepositoryDTO } from "../dtos/UserRepositoryDTOs.ts";
import { randomUUID } from "node:crypto";

class FakeUserRepository implements IUserRepository {
  private db: UserRepositoryDTO[] = [
    {
      id: randomUUID(),
      email: "fail@fail.com",
      password: "123468",
      username: "test",
    },
  ];

  createUser(
    data: UserRepositoryDTO,
  ): Promise<Result<UserRepositoryDTO, string>> {
    const alreadyUsed = this.db.some((d) => {
      if (d.email == data.email) {
        return true;
      }
      return false;
    });
    if (alreadyUsed) {
      return Promise.resolve(ResultBuilder.fail("Already Exist"));
    }
    this.db.push(data);
    return Promise.resolve(ResultBuilder.ok(data));
  }
}

describe("UserService test", () => {
  it("should return success when user is created", async () => {
    const userService = new CreateUserService(new FakeUserRepository());
    const data: CreateUserServiceDTO = {
      email: "success@success.com",
      password: "1234",
      username: "test",
    };
    const result = await userService.create(data);
    expect(result).toBeInstanceOf(Success);
  });

  it("should return fail when user is already created", async () => {
    const userService = new CreateUserService(new FakeUserRepository());
    const data: CreateUserServiceDTO = {
      email: "fail@fail.com",
      password: "1234",
      username: "test",
    };
    const secondResult = await userService.create(data);
    expect(secondResult).toBeInstanceOf(Failure);
  });
});
