import { describe, expect, it } from "@jest/globals";
import { UserService } from "./UserService.ts";
import { Success } from "../../../shared/results/Result.ts";
import { CreateUserServiceDTO } from "./entities/CreateUserServiceDTO.ts";

describe("UserService test", () => {
  const userService = new UserService();
  it("should return success when user is created", async () => {
    const data: CreateUserServiceDTO = {
      email: "test@test.com",
      password: "1234",
      name: "test",
    };
    const result = await userService.create(data);
    expect(result).toBeInstanceOf(Success);
  });
});
