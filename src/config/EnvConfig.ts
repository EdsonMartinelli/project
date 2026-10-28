import dotenv from "dotenv";
import path from "path";
import z from "zod";

const config = z.strictObject({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().nonnegative().int(),
});

export class EnvConfig {
  private static DATABASE_URL: string;
  private static PORT: number = 3000;

  private constructor() {}

  static build(): void {
    dotenv.config({
      path: path.join(import.meta.dirname, "../../.env.development"),
      quiet: true,
      debug: false,
    });
    const processVars = {
      DATABASE_URL: process.env.DATABASE_URL,
      PORT: process.env.PORT,
    };
    const configAssert = config.safeParse(processVars);

    if (!configAssert.success) return;

    this.DATABASE_URL = configAssert.data.DATABASE_URL;
    this.PORT = configAssert.data.PORT;
  }

  static getDatabaseURL() {
    return this.DATABASE_URL;
  }

  static getPORT() {
    return this.PORT;
  }
}
