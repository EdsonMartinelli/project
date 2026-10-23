import { describe, expect, it } from "@jest/globals";
import { UserService, type userInfo } from "./UserService.ts";
import { Success } from "../../shared/Result.ts";
import type { DomainError } from "../../shared/DomainError.ts";

describe("UserService test", () => {
  const userService = new UserService();
  it("should return success when user is created", async () => {
    const data = {
      email: "test@test.com",
      password: "1234",
    };
    const result = await userService.create(data);
    expect(result).toBeInstanceOf(Success);
  });
});
