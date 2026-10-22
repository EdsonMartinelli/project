import type { DomainError } from "./DomainError.ts";

export class Result<T> {
  private data: T | null;
  private failure: DomainError | null;

  private constructor(data: T | null, failure: DomainError | null) {
    this.data = data;
    this.failure = failure;
  }

  static ok<T>(data: T): Result<T> {
    return new Result(data, null);
  }

  static fail(failure: DomainError) {
    return new Result(null, failure);
  }

  isSuccess(): boolean {
    return this.failure == null;
  }
}
