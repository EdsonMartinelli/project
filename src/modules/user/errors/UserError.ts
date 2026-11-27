export interface UserError {
  readonly error: number;
  readonly message: string;
}

export class DuplicatedUser implements UserError {
  public error: number = 400;
  public message: string = "Duplicated User!";
}

export class HashPasswordFailUser implements UserError {
  public error: number = 400;
  public message: string = "Cant hash the password!";
}

export class InvalidFieldsUser implements UserError {
  public error: number = 400;
  public message: string = "Fields are invalid!";
}
