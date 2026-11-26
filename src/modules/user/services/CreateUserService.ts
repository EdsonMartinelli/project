import { randomUUID } from "node:crypto";
import { ResultBuilder, type Result } from "../../../shared/results/Result.ts";
import { UserRepositoryDTO } from "../dtos/UserRepositoryDTOs.ts";
import {
  CreateUserServiceDTO,
  UserServiceDTO,
} from "../dtos/UserServiceDTOs.ts";
import type { IUserRepository } from "../repositories/IUserRepository.ts";
import type { IHasher } from "../../../shared/hash/Hasher.ts";

export class CreateUserService {
  private userRepository: IUserRepository;
  private hasher: IHasher;

  constructor(userRepository: IUserRepository, hasher: IHasher) {
    this.userRepository = userRepository;
    this.hasher = hasher;
  }

  public create(
    data: CreateUserServiceDTO,
  ): Promise<Result<UserServiceDTO, string>> {
    return this.generateUserId(data)
      .asynchronous()
      .bind(this.generateHash)
      .bind(this.saveUserInDB)
      .bindSync(this.getServiceType)
      .finish();
  }

  private generateUserId(
    data: CreateUserServiceDTO,
  ): Result<UserServiceDTO, string> {
    const userWithId = UserServiceDTO.create({
      id: randomUUID(),
      email: data.email,
      password: data.password,
      username: data.username,
    });
    return ResultBuilder.ok(userWithId);
  }

  private generateHash = async (user: UserServiceDTO) => {
    const hashedPassword = await this.hasher.hash(user.password);
    return ResultBuilder.unwrap(hashedPassword, {
      onSuccess: (data): Result<UserServiceDTO, string> => {
        return ResultBuilder.ok(
          UserServiceDTO.create({ ...user, password: data }),
        );
      },
      onFailure: (error): Result<UserServiceDTO, string> => {
        return ResultBuilder.fail("Error on hash password");
      },
    });
  };

  private saveUserInDB = async (
    user: UserServiceDTO,
  ): Promise<Result<UserRepositoryDTO, string>> => {
    const userRepository = UserRepositoryDTO.create({
      id: user.id,
      email: user.email,
      password: user.password,
      username: user.username,
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
      username: user.username,
    });
    return ResultBuilder.ok(userConverted);
  }
}
