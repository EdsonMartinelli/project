type handlers<T, E, R> = {
  onSuccess: (data: T) => R;
  onFailure: (error: E) => R;
};

export interface Result<T, E> {
  detach<R>(handlers: handlers<T, E, R>): R;
  bind<D, U>(fn: (data: T) => Result<D, U>): Result<D, E | U>;
  bindAsync<D, U>(
    fn: (data: T) => Promise<Result<D, U>>,
  ): Promise<Result<D, E | U>>;
  asynchronous(): ResultAsync<T, E>;
}

export class ResultAsync<T, E> {
  private readonly promisedData: Promise<Result<T, E>>;
  constructor(promisedData: Promise<Result<T, E>>) {
    this.promisedData = promisedData;
  }

  bind<D, U>(fn: (data: T) => Promise<Result<D, U>>): ResultAsync<D, E | U> {
    return new ResultAsync(
      this.promisedData.then((data) => data.bindAsync(fn)),
    );
  }

  bindSync<D, U>(fn: (data: T) => Result<D, U>): ResultAsync<D, E | U> {
    return new ResultAsync(this.promisedData.then((data) => data.bind(fn)));
  }

  finish() {
    return this.promisedData;
  }
}

export class Success<T, E> implements Result<T, E> {
  private readonly data: T;
  constructor(data: T) {
    this.data = data;
  }
  detach<R>(handler: handlers<T, E, R>): R {
    return handler.onSuccess(this.data);
  }

  bind<D, U>(fn: (data: T) => Result<D, U>): Result<D, U> {
    return fn(this.data);
  }

  bindAsync<D, U>(
    fn: (data: T) => Promise<Result<D, U>>,
  ): Promise<Result<D, U>> {
    return fn(this.data);
  }

  asynchronous() {
    return new ResultAsync<T, E>(
      new Promise((resolve, _) => {
        resolve(this);
      }),
    );
  }
}

export class Failure<T, E> implements Result<T, E> {
  private readonly error: E;
  constructor(error: E) {
    this.error = error;
  }

  detach<R>(handler: handlers<T, E, R>): R {
    return handler.onFailure(this.error);
  }

  bind<D, U>(fn: (data: T) => Result<D, U>): Result<D, E> {
    return new Failure<D, E>(this.error);
  }

  bindAsync<D, U>(
    fn: (data: T) => Promise<Result<D, U>>,
  ): Promise<Result<D, E>> {
    return new Promise((resolve, _) => {
      resolve(new Failure<D, E>(this.error));
    });
  }

  asynchronous() {
    return new ResultAsync<T, E>(
      new Promise((resolve, _) => {
        resolve(this);
      }),
    );
  }
}

export class ResultBuilder {
  static ok<T, E>(data: T): Success<T, E> {
    return new Success(data);
  }

  static fail<T, E>(failure: E): Failure<T, E> {
    return new Failure(failure);
  }

  static unwrap<T, E, R>(
    result: Result<T, E>,
    handlers: {
      onSuccess: (data: T) => R;
      onFailure: (error: E) => R;
    },
  ) {
    return result.detach(handlers);
  }

  static async unwrapAsync<T, E, R>(
    result: ResultAsync<T, E>,
    handlers: {
      onSuccess: (data: T) => R;
      onFailure: (error: E) => R;
    },
  ) {
    const promisedResult = await result.finish();
    return promisedResult.detach(handlers);
  }
}

export class ResultUtil {
  static bindWith<T, U, D>(
    fn: (data: T) => Promise<Result<D, U>>,
  ): (obj: Result<T, U>) => Promise<Result<D, U>> {
    return (obj: Result<T, U>) => obj.bindAsync(fn);
  }
}
