import { randomUUID } from "node:crypto";
import { ResultBuilder, type Result } from "../../../shared/results/Result.ts";
import { UserRepositoryDTO } from "../dtos/UserRepositoryDTOs.ts";
import {
  CreateUserServiceDTO,
  UserServiceDTO,
} from "../dtos/UserServiceDTOs.ts";
import type { IUserRepository } from "../repositories/IUserRepository.ts";
import type { IHasher } from "../../../shared/hash/Hasher.ts";
import { InternalError, type UserError } from "../errors/UserError.ts";

export class CreateUserService {
  private userRepository: IUserRepository;
  private hasher: IHasher;

  constructor(userRepository: IUserRepository, hasher: IHasher) {
    this.userRepository = userRepository;
    this.hasher = hasher;
  }

  public create(
    data: CreateUserServiceDTO,
  ): Promise<Result<UserServiceDTO, UserError>> {
    return this.generateUserId(data)
      .asynchronous()
      .bind(this.generatePasswordHash)
      .bind(this.saveUserInDB)
      .bindSync(this.getServiceType)
      .finish();
  }

  private generateUserId(
    data: CreateUserServiceDTO,
  ): Result<UserServiceDTO, UserError> {
    const userWithId = UserServiceDTO.create({
      id: randomUUID(),
      email: data.email,
      password: data.password,
      username: data.username,
    });
    return ResultBuilder.ok(userWithId);
  }

  private generatePasswordHash = async (
    user: UserServiceDTO,
  ): Promise<Result<UserServiceDTO, UserError>> => {
    const hashedPassword = await this.hasher.hash(user.password);
    return ResultBuilder.unwrap(hashedPassword, {
      onSuccess: (data): Result<UserServiceDTO, UserError> => {
        return ResultBuilder.ok(
          UserServiceDTO.create({ ...user, password: data }),
        );
      },
      onFailure: (error): Result<UserServiceDTO, UserError> => {
        return ResultBuilder.fail(new InternalError());
      },
    });
  };

  private saveUserInDB = async (
    user: UserServiceDTO,
  ): Promise<Result<UserRepositoryDTO, UserError>> => {
    const userRepository = UserRepositoryDTO.create({
      id: user.id,
      email: user.email,
      password: user.password,
      username: user.username,
    });

    const userCreated = await this.userRepository.createUser(userRepository);
    return ResultBuilder.unwrap(userCreated, {
      onSuccess: (data): Result<UserServiceDTO, UserError> => {
        return ResultBuilder.ok(data);
      },
      onFailure: (error): Result<UserServiceDTO, UserError> => {
        return ResultBuilder.fail(error);
      },
    });
  };

  private getServiceType(
    user: UserRepositoryDTO,
  ): Result<UserServiceDTO, UserError> {
    const userConverted = UserServiceDTO.create({
      id: user.id,
      email: user.email,
      password: user.password,
      username: user.username,
    });
    return ResultBuilder.ok(userConverted);
  }
}
