import { EnvConfig } from "./EnvConfig.ts";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: EnvConfig.get().databaseURL(),
});

export const database = drizzle({ client: pool });
