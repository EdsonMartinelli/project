import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { UserConstraints } from "../modules/user/constraints/UserConstraints.ts";
export const usersTable = pgTable("users", {
  id: uuid().primaryKey().unique(),
  username: varchar({ length: UserConstraints.USERNAME_MAX_LENGTH }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: UserConstraints.PASSWORD_MAX_LENGTH }).notNull(),
});
