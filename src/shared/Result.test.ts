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
      expect(handlerMock).toHaveBeenCalledTimes(1);
      expect(result).toBe(0);
    });

    it("should return the data type when execute bind function", () => {
      const success = new Success(1);
      const handlerMock = jest.fn((x: number) => {
        return new Success(2);
      });

      const result = success.bind(handlerMock).detach({
        onSuccess: (data) => data,
        onFailure: (er) => 0,
      });

      expect(handlerMock).toHaveBeenCalledWith(1);
      expect(handlerMock).toHaveBeenCalledTimes(1);
      expect(result).toBe(2);
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
      expect(handlerMock).toHaveBeenCalledTimes(1);
      expect(result).toBe(0);
    });

    it("should return the first failure error when execute bind function", () => {
      const failure = new Failure<number, number>(1);
      const handlerMock = jest.fn((x: number) => {
        return new Failure<number, number>(200);
      });

      const result = failure.bind(handlerMock).detach({
        onSuccess: (data) => data,
        onFailure: (er) => er,
      });

      expect(handlerMock).toHaveBeenCalledTimes(0);
      expect(result).toBe(1);
    });

    it("should return Failure even when there is a Success after it", () => {
      const failure = new Failure<number, number>(1);
      const handlerMock = jest.fn((x: number) => {
        return new Success(200);
      });

      const result = failure.bind(handlerMock).detach({
        onSuccess: (data) => data,
        onFailure: (er) => er,
      });

      expect(handlerMock).toHaveBeenCalledTimes(0);
      expect(result).toBe(1);
    });

    it("should return Failure even when there is a Success before it", () => {
      const success = new Success<number, number>(1);

      const fnSucess = (x: number) => {
        return new Success(2);
      };

      const handlerMock = jest.fn((x: number) => {
        return new Failure<number, number>(500);
      });

      const result = success
        .bind(fnSucess)
        .bind(handlerMock)
        .detach({
          onSuccess: (data) => data,
          onFailure: (er) => er,
        });

      expect(handlerMock).toHaveBeenCalledTimes(1);
      expect(result).toBe(500);
    });

    it("should return Failure even when there is a Success before and after it", () => {
      const success = new Success<number, number>(1);

      const fnSucess = (x: number) => {
        return new Success(2);
      };

      const handlerMock = jest.fn((x: number) => {
        return new Failure<number, number>(500);
      });

      const fnSucess2 = (x: number) => {
        return new Success(3);
      };

      const result = success
        .bind(fnSucess)
        .bind(handlerMock)
        .bind(fnSucess2)
        .detach({
          onSuccess: (data) => data,
          onFailure: (er) => er,
        });

      expect(handlerMock).toHaveBeenCalledTimes(1);
      expect(result).toBe(500);
    });
  });
});
