import { UserService } from "../services/user/UserService.ts";
import { type Request, type Response } from "express";
import { ResultBuilder } from "../shared/Result.ts";
import z from "zod";

const user = z.strictObject({
  email: z.email(),
  password: z.string().max(30),
});

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public async getMessage(req: Request, res: Response) {
    const data = user.safeParse(req.body);

    if (!data.success) return res.json({ message: "controller error" });
    const x = await this.userService.create(data.data);
    ResultBuilder.unwrap(x, {
      onSuccess: (data) => {
        res.json(data);
      },
      onFailure: (er) => {
        res.json(er);
      },
    });
  }
}
