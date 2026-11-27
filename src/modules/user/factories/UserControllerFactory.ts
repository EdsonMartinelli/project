import { Hasher } from "../../../shared/hash/Hasher.ts";
import { UserController } from "../controllers/UserController.ts";
import { UserRepository } from "../repositories/UserRepository.ts";
import { CreateUserService } from "../services/CreateUserService.ts";

export class UserControllerFactory {
  private userController: UserController;
  constructor() {
    this.userController = new UserController(
      new CreateUserService(new UserRepository(), new Hasher()),
    );
  }

  public getController(): UserController {
    return this.userController;
  }
}
