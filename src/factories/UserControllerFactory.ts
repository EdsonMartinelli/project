import { UserController } from "../controllers/UserController.ts";
import { UserService } from "../services/user/UserService.ts";

export class UserControllerFactory {
  private userController: UserController;
  constructor() {
    const userService = new UserService();
    this.userController = new UserController(userService);
  }

  public getController(): UserController {
    return this.userController;
  }
}
