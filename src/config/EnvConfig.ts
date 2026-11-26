import dotenv from "dotenv";
import path from "path";
import z from "zod";

const config = z.strictObject({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().nonnegative().int(),
  SECRET: z.string(),
});

export class EnvConfig {
  private DATABASE_URL: string;
  private PORT: number = 3000;
  private SECRET: string;
  private static env: EnvConfig | null;

  private constructor(data: {
    DATABASE_URL: string;
    PORT: number;
    SECRET: string;
  }) {
    this.DATABASE_URL = data.DATABASE_URL;
    this.PORT = data.PORT;
    this.SECRET = data.SECRET;
  }

  static get(): EnvConfig {
    if (this.env != null) return this.env;

    dotenv.config({
      path: path.join(import.meta.dirname, "../../.env.development"),
      quiet: true,
      debug: false,
    });
    const processVars = {
      DATABASE_URL: process.env.DATABASE_URL,
      PORT: process.env.PORT,
      SECRET: process.env.SECRET,
    };
    const configAssert = config.safeParse(processVars);

    if (!configAssert.success)
      throw Error("Not all required environment variables are set!");
    this.env = new EnvConfig(configAssert.data);
    return this.env;
  }

  databaseURL() {
    return this.DATABASE_URL;
  }

  port() {
    return this.PORT;
  }

  secret() {
    return this.SECRET;
  }
}
