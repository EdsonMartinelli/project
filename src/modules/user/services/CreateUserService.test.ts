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

class FakeUserRepository implements IUserRepository {
  private db: UserRepositoryDTO[] = [];

  createUser(
    data: UserRepositoryDTO,
  ): Promise<Result<UserRepositoryDTO, string>> {
    const alreadyUsed = this.db.some((d) => {
      if (
        d.id == data.id &&
        d.email == data.email &&
        d.password == data.password &&
        d.name == data.name
      ) {
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
      email: "test@test.com",
      password: "1234",
      name: "test",
    };
    const result = await userService.create(data);
    expect(result).toBeInstanceOf(Success);
  });

  it("should return fail when user is already created", async () => {
    const userService = new CreateUserService(new FakeUserRepository());
    const data: CreateUserServiceDTO = {
      email: "test@test.com",
      password: "1234",
      name: "test",
    };
    const result = await userService.create(data);
    const secondResult = await userService.create(data);
    expect(secondResult).toBeInstanceOf(Failure);
  });
});
