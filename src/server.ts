import { app } from "./app.ts";
import type { Server } from "http";
import { EnvConfig } from "./config/EnvConfig.ts";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { usersTable } from "./database/schema.ts";

function gracefulShutdown(signal: string, server: Server) {
  console.log(`${signal} signal received: closing HTTP server!`);
  server.close(() => {
    console.log("HTTP server closed.");
  });
}

function bootstrap(): void {
  const pool = new Pool({
    connectionString: EnvConfig.get().databaseURL(),
  });
  const db = drizzle({ client: pool });

  console.log(`Configuration loaded!`);
  const server = app.listen(EnvConfig.get().port(), () => {
    console.log(`Listening on port ${EnvConfig.get().port()}`);
  });

  process.on("SIGTERM", () => {
    gracefulShutdown("SIGTERM", server);
  });

  process.on("SIGINT", () => {
    gracefulShutdown("SIGINT", server);
  });
}

bootstrap();
