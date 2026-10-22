type handlers<T, E, R> = {
  onSuccess: (x: T) => R;
  onFailure: (x: E) => R;
};

export interface Result<T, E> {
  detach<R>(handlers: handlers<T, E, R>): R;
}
export class Success<T, E> implements Result<T, E> {
  private readonly data: T;
  constructor(data: T) {
    this.data = data;
  }
  detach<R>(handler: handlers<T, E, R>): R {
    return handler.onSuccess(this.data);
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
}

// const res = Result.ok<number, DomainError>(1);
// Result.unwrap(res, {
//   onSuccess: (x) => {
//     const y = x;
//     console.log(y);
//   },
//   onFailure: (x) => {
//     console.log(x);
//   },
// });
