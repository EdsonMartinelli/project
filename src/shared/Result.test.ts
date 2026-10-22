import { describe, expect, it, jest } from "@jest/globals";
import { Failure, ResultBuilder, Success } from "./Result.ts";

describe("Result Monad Pattern test", () => {
  describe("Result Builder", () => {
    it("should create a correct result in ok case", () => {
      const result = ResultBuilder.ok(1);
      expect(result).toBeInstanceOf(Success);
    });

    it("should create a correct result in fail case", () => {
      const result = ResultBuilder.fail(1);
      expect(result).toBeInstanceOf(Failure);
    });

    it("should detach correctly when use unwrap function", () => {
      const resultOk = ResultBuilder.ok(1);
      const resultFail = ResultBuilder.fail(2);

      const resultOkOutput = ResultBuilder.unwrap(resultOk, {
        onSuccess: (x) => x * 2,
        onFailure: () => 0,
      });

      const resultFailOutput = ResultBuilder.unwrap(resultFail, {
        onSuccess: (x) => x,
        onFailure: (x) => x * 2,
      });

      expect(resultOkOutput).toBe(2);
      expect(resultFailOutput).toBe(4);
    });
  });

  describe("Sucess", () => {
    it("should execute detach correctly using onSuccess field in handlers", () => {
      const success = new Success(1);
      const handlerMock = jest.fn((x: number) => {
        return x - 1;
      });

      const result = success.detach({
        onSuccess: handlerMock,
        onFailure: () => 777,
      });

      expect(handlerMock).toHaveBeenCalledWith(1);
      expect(result).toBe(0);
    });
  });

  describe("Failure", () => {
    it("should execute detach correctly using onFailure field in handlers", () => {
      const success = new Failure(1);
      const handlerMock = jest.fn((x: number) => {
        return x - 1;
      });

      const result = success.detach({
        onSuccess: () => 777,
        onFailure: handlerMock,
      });

      expect(handlerMock).toHaveBeenCalledWith(1);
      expect(result).toBe(0);
    });
  });
});
