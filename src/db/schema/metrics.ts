import { InferModel } from "drizzle-orm";
import { pgTable, uuid, integer, varchar } from "drizzle-orm/pg-core";

const defaultValue = 0;

export const newMetricSchema = pgTable("metrics", {
  id: uuid("id").defaultRandom().primaryKey(),
  subscribeCount: integer("subscribe_count").default(defaultValue),
  unsubscribeCount: integer("unsubscribe_count").default(defaultValue),
  sendCount: integer("send_count").default(defaultValue),
  sendErrorCount: integer("send_error_count").default(defaultValue),
  exchangeRate: varchar("exchange_rate"),
});

export type TNewMetric = InferModel<typeof newMetricSchema>;
