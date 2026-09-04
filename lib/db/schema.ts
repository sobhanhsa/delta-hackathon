import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
};

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  basePrice: real("base_price").notNull(),
  unitCost: real("unit_cost").notNull(),
  safetyStock: integer("safety_stock").notNull().default(0),
  installMinutesPerUnit: real("install_minutes_per_unit").notNull().default(0),
  ...timestamps,
});

export const customers = sqliteTable("customers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  ...timestamps,
});

export const opportunities = sqliteTable("opportunities", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").notNull().references(() => customers.id),
  productId: text("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  unitPrice: real("unit_price").notNull(),
  discountPercent: real("discount_percent").notNull().default(0),
  dueDate: text("due_date").notNull(),
  stage: text("stage").notNull().default("new"),
  ...timestamps,
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").notNull().references(() => customers.id),
  productId: text("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  unitPrice: real("unit_price").notNull(),
  confirmedAt: text("confirmed_at").notNull(),
  sourceOpportunityId: text("source_opportunity_id"),
  ...timestamps,
});

export const inventory = sqliteTable("inventory", {
  productId: text("product_id").primaryKey().references(() => products.id),
  available: integer("available").notNull().default(0),
  ...timestamps,
});

export const capacity = sqliteTable("capacity", {
  id: integer("id").primaryKey(),
  totalHours: real("total_hours").notNull(),
  ...timestamps,
});

export const cash = sqliteTable("cash", {
  id: integer("id").primaryKey(),
  balance: real("balance").notNull().default(0),
  receiptsJson: text("receipts_json").notNull().default("[]"),
  paymentsJson: text("payments_json").notNull().default("[]"),
  expensesJson: text("expenses_json").notNull().default("[]"),
  ...timestamps,
});

export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey(),
  targetMarginPercent: real("target_margin_percent").notNull(),
  minOperatingCash: real("min_operating_cash").notNull(),
  shippingFlatFee: real("shipping_flat_fee").notNull(),
  shippingPerUnitFee: real("shipping_per_unit_fee").notNull(),
  capacityThresholdsJson: text("capacity_thresholds_json").notNull(),
  inventoryAlertsEnabled: integer("inventory_alerts_enabled", { mode: "boolean" }).notNull().default(true),
  capacityAlertsEnabled: integer("capacity_alerts_enabled", { mode: "boolean" }).notNull().default(true),
  cashAlertsEnabled: integer("cash_alerts_enabled", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const alerts = sqliteTable("alerts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  severity: text("severity").notNull(),
  category: text("category").notNull(),
  reason: text("reason").notNull(),
  effect: text("effect").notNull(),
  suggestion: text("suggestion").notNull(),
  acknowledgedAt: text("acknowledged_at"),
  ...timestamps,
});

export const events = sqliteTable("events", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  payloadJson: text("payload_json").notNull().default("{}"),
  occurredAt: text("occurred_at").notNull(),
  ...timestamps,
});

export const schema = {
  products,
  customers,
  opportunities,
  orders,
  inventory,
  capacity,
  cash,
  settings,
  alerts,
  events,
};
