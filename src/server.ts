import { app } from "./app.ts";
import type { Server } from "http";

const port = 3000;

function gracefulShutdown(signal: string, server: Server) {
  console.log(`${signal} signal received: closing HTTP server!`);
  server.close(() => {
    console.log("HTTP server closed.");
  });
}

function bootstrap(): void {
  const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });

  process.on("SIGTERM", () => {
    gracefulShutdown("SIGTERM", server);
  });

  process.on("SIGINT", () => {
    gracefulShutdown("SIGINT", server);
  });
}

bootstrap();
