CREATE TABLE IF NOT EXISTS "metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subscribe_count" numeric,
	"unsubscribe_count" numeric,
	"send_count" numeric,
	"send_error_count" numeric,
	"exchange_rate" numeric
);
