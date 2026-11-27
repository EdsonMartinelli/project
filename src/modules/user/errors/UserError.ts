export type UserErrorKind = "INTERNAL" | "INVALID_FIELDS" | "DUPLICATED_USER";

export interface UserError {
  readonly kind: UserErrorKind;
  readonly message: string;
}

export class DuplicatedUser implements UserError {
  public readonly kind = "DUPLICATED_USER";
  public readonly message: string = "Duplicated User!";
}

export class InvalidFieldsUser implements UserError {
  public readonly kind = "INVALID_FIELDS";
  public readonly message: string = "Fields are invalid!";
}

export class InternalError implements UserError {
  public readonly kind = "INTERNAL";
  public readonly message: string = "Internal Error!";
}
