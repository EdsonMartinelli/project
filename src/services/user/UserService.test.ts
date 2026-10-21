import { describe, expect, it } from "@jest/globals";
import { UserService } from "./UserService.ts";

describe("UserService test", () => {
  const userService = new UserService();
  it("should return success when user is created", () => {
    const result = userService.create({
      email: "test@test.com",
      password: "1234",
    });
    expect(result).toEqual(Result.ok());
  });
});
