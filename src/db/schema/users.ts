import { InferModel } from "drizzle-orm";
import { pgTable, varchar, uuid, uniqueIndex } from "drizzle-orm/pg-core";

export const newUserSchema = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 50 }).notNull(),
    createdAt: varchar("created_at"),
  },
  (table) => ({
    emailIndex: uniqueIndex("emailIdx").on(table.email), ///unique
  })
);

export type TNewUser = InferModel<typeof newUserSchema>;
