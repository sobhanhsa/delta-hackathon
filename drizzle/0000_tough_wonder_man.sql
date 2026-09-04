CREATE TABLE `business_alerts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`rule_key` text NOT NULL,
	`severity` text NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`cause` text NOT NULL,
	`impact` text NOT NULL,
	`suggested_correction` text NOT NULL,
	`entity_type` text,
	`entity_id` integer,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`resolved_at` text
);
--> statement-breakpoint
CREATE INDEX `business_alerts_status_idx` ON `business_alerts` (`status`);--> statement-breakpoint
CREATE INDEX `business_alerts_entity_idx` ON `business_alerts` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE TABLE `capacity_periods` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`month` text NOT NULL,
	`total_minutes` integer NOT NULL,
	`booked_minutes` integer DEFAULT 0 NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `capacity_periods_month_unique` ON `capacity_periods` (`month`);--> statement-breakpoint
CREATE TABLE `customers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`company` text,
	`email` text,
	`phone` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `financial_transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`amount` real NOT NULL,
	`description` text NOT NULL,
	`date` text NOT NULL,
	`related_entity_type` text,
	`related_entity_id` integer,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `financial_transactions_type_idx` ON `financial_transactions` (`type`);--> statement-breakpoint
CREATE TABLE `inventory` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer NOT NULL,
	`on_hand` integer DEFAULT 0 NOT NULL,
	`reserved` integer DEFAULT 0 NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `inventory_product_unique` ON `inventory` (`product_id`);--> statement-breakpoint
CREATE TABLE `management_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`target_profit_margin` real NOT NULL,
	`minimum_operational_cash` real NOT NULL,
	`fixed_shipping_cost` real NOT NULL,
	`shipping_cost_per_unit` real NOT NULL,
	`capacity_warning_threshold` real NOT NULL,
	`capacity_critical_threshold` real NOT NULL,
	`alert_toggles` text NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `opportunities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`customer_id` integer NOT NULL,
	`product_id` integer NOT NULL,
	`quantity` integer NOT NULL,
	`unit_price` real,
	`status` text DEFAULT 'draft' NOT NULL,
	`feasibility` text DEFAULT 'feasible' NOT NULL,
	`expected_close_date` text,
	`notes` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `opportunities_customer_idx` ON `opportunities` (`customer_id`);--> statement-breakpoint
CREATE INDEX `opportunities_product_idx` ON `opportunities` (`product_id`);--> statement-breakpoint
CREATE INDEX `opportunities_status_idx` ON `opportunities` (`status`);--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`opportunity_id` integer,
	`customer_id` integer NOT NULL,
	`product_id` integer NOT NULL,
	`quantity` integer NOT NULL,
	`unit_price` real NOT NULL,
	`status` text DEFAULT 'confirmed' NOT NULL,
	`order_date` text NOT NULL,
	`delivery_date` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`opportunity_id`) REFERENCES `opportunities`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `orders_customer_idx` ON `orders` (`customer_id`);--> statement-breakpoint
CREATE INDEX `orders_product_idx` ON `orders` (`product_id`);--> statement-breakpoint
CREATE TABLE `organizational_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timestamp` text DEFAULT (datetime('now')) NOT NULL,
	`event_type` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` integer NOT NULL,
	`before_state` text,
	`after_state` text,
	`reason` text,
	`generated_alerts` text DEFAULT '[]' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `organizational_events_entity_idx` ON `organizational_events` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE INDEX `organizational_events_type_idx` ON `organizational_events` (`event_type`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`sku` text NOT NULL,
	`unit_price` real NOT NULL,
	`unit_cost` real NOT NULL,
	`installation_minutes_per_unit` integer NOT NULL,
	`safety_stock` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_sku_unique` ON `products` (`sku`);