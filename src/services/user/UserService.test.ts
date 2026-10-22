import { describe, expect, it } from "@jest/globals";
import { UserService } from "./UserService.ts";
import { Success } from "../../shared/Result.ts";

describe("UserService test", () => {
  const userService = new UserService();
  it("should return success when user is created", () => {
    const data = {
      email: "test@test.com",
      password: "1234",
    };
    const result = userService.create(data);
    expect(result).toBeInstanceOf(Success);
  });
});
