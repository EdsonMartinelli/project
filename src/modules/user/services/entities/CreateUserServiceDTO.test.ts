import { describe, expect, it } from "@jest/globals";
import { CreateUserServiceDTO } from "./CreateUserServiceDTO.ts";
import { Failure, Success } from "../../../../shared/results/Result.ts";

describe("CreateUserServiceDTO tests", () => {
  it("should return success when user input fields is ok", async () => {
    const data = {
      email: "test@test.com",
      password: "1234",
      name: "test",
    };
    const user = CreateUserServiceDTO.create(data);
    expect(user).toBeInstanceOf(Success);
  });

  it("should return failure when user email is malformed", async () => {
    const data = {
      email: "test",
      password: "1234",
      name: "test",
    };
    const user = CreateUserServiceDTO.create(data);
    expect(user).toBeInstanceOf(Failure);
  });

  it("should return failure when any user input fields is undefined", async () => {
    const data = {
      email: "test@test.com",
      password: "1234",
    };
    const user = CreateUserServiceDTO.create(data);
    expect(user).toBeInstanceOf(Failure);
  });

  it("should return failure when user password is too big", async () => {
    const data = {
      email: "test@test.com",
      password: "123456789101112131415161718192021222324252627",
      name: "test",
    };
    const user = CreateUserServiceDTO.create(data);
    expect(user).toBeInstanceOf(Failure);
  });
});
