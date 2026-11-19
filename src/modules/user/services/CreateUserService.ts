import { ResultBuilder, type Result } from "../../../shared/results/Result.ts";
import { UserRepositoryDTO } from "../dtos/UserRepositoryDTOs.ts";
import {
  CreateUserServiceDTO,
  UserServiceDTO,
} from "../dtos/UserServiceDTOs.ts";
import type { IUserRepository } from "../repositories/IUserRepository.ts";

export class CreateUserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public create(
    data: CreateUserServiceDTO,
  ): Promise<Result<UserServiceDTO, string>> {
    return this.generateUserId(data)
      .asynchronous()
      .bind(this.saveUserInDB)
      .bindSync(this.getServiceType)
      .finish();
  }

  private generateUserId(
    data: CreateUserServiceDTO,
  ): Result<UserServiceDTO, string> {
    const userWithId = UserServiceDTO.create({
      id: "1",
      email: data.email,
      password: data.password,
      name: data.name,
    });
    return ResultBuilder.ok(userWithId);
  }

  private saveUserInDB = async (
    user: UserServiceDTO,
  ): Promise<Result<UserRepositoryDTO, string>> => {
    const userRepository = UserRepositoryDTO.create({
      id: user.id,
      email: user.email,
      password: user.password,
      name: user.name,
    });
    return await this.userRepository.createUser(userRepository);
  };

  private getServiceType(
    user: UserRepositoryDTO,
  ): Result<UserServiceDTO, string> {
    const userConverted = UserServiceDTO.create({
      id: user.id,
      email: user.email,
      password: user.password,
      name: user.name,
    });
    return ResultBuilder.ok(userConverted);
  }
}
