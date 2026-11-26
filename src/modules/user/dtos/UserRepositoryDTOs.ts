export class UserRepositoryDTO {
  public readonly id: string;
  public readonly email: string;
  public readonly password: string;
  public readonly username: string;

  private constructor(data: {
    id: string;
    email: string;
    password: string;
    username: string;
  }) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.username = data.username;
  }

  static create(data: UserRepositoryDTO): UserRepositoryDTO {
    return new UserRepositoryDTO(data);
  }
}
