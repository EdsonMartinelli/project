import { hash, verify } from "argon2";
import { EnvConfig } from "../../config/EnvConfig.ts";
import { ResultBuilder, type Result } from "../results/Result.ts";

export interface IHasher {
  hash(value: string): Promise<Result<string, string>>;
  compare(value: string, hash: string): Promise<Result<boolean, string>>;
}

export class Hasher implements IHasher {
  async hash(value: string): Promise<Result<string, string>> {
    try {
      const hashedValue = await hash(value, {
        secret: Buffer.from(EnvConfig.get().secret()),
      });
      return ResultBuilder.ok(hashedValue);
    } catch (e: unknown) {
      return ResultBuilder.fail("Can't create the hash!");
    }
  }
  async compare(value: string, hash: string): Promise<Result<boolean, string>> {
    try {
      if (
        await verify(hash, value, {
          secret: Buffer.from(EnvConfig.get().secret()),
        })
      ) {
        return ResultBuilder.ok(true);
      } else {
        return ResultBuilder.fail("The password does not match!");
      }
    } catch (err) {
      return ResultBuilder.fail("Can't compare the hashs");
    }
  }
}
