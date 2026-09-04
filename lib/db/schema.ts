import { sql } from "drizzle-orm";
import {
  index,
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

const timestamp = (name: string) => text(name).notNull();

const timestamps = {
  createdAt: timestamp("created_at").default(sql`(datetime('now'))`),
  updatedAt: timestamp("updated_at").default(sql`(datetime('now'))`),
};

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
export const products = sqliteTable(
  "products",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    sku: text("sku").notNull(),
    unitPrice: real("unit_price").notNull(),
    unitCost: real("unit_cost").notNull(),
    installationMinutesPerUnit: integer("installation_minutes_per_unit").notNull(),
    safetyStock: integer("safety_stock").notNull().default(0),
    ...timestamps,
  },
  (t) => [uniqueIndex("products_sku_unique").on(t.sku)],
);

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------
export const customers = sqliteTable("customers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  company: text("company"),
  email: text("email"),
  phone: text("phone"),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// Sales opportunities
// ---------------------------------------------------------------------------
export const OPPORTUNITY_STATUSES = ["draft", "quoted", "confirmed", "lost"] as const;
export type OpportunityStatus = (typeof OPPORTUNITY_STATUSES)[number];

export const FEASIBILITY_VALUES = ["feasible", "conditional", "infeasible"] as const;
export type Feasibility = (typeof FEASIBILITY_VALUES)[number];

export const opportunities = sqliteTable(
  "opportunities",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    customerId: integer("customer_id")
      .notNull()
      .references(() => customers.id),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id),
    quantity: integer("quantity").notNull(),
    // Optional price override; null means "use the product's current price".
    unitPrice: real("unit_price"),
    status: text("status", { enum: OPPORTUNITY_STATUSES }).notNull().default("draft"),
    feasibility: text("feasibility", { enum: FEASIBILITY_VALUES })
      .notNull()
      .default("feasible"),
    expectedCloseDate: text("expected_close_date"),
    notes: text("notes"),
    ...timestamps,
  },
  (t) => [
    index("opportunities_customer_idx").on(t.customerId),
    index("opportunities_product_idx").on(t.productId),
    index("opportunities_status_idx").on(t.status),
  ],
);

// ---------------------------------------------------------------------------
// Orders (confirmed commitments)
// ---------------------------------------------------------------------------
export const ORDER_STATUSES = ["confirmed", "in_progress", "completed", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const orders = sqliteTable(
  "orders",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    opportunityId: integer("opportunity_id").references(() => opportunities.id),
    customerId: integer("customer_id")
      .notNull()
      .references(() => customers.id),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id),
    quantity: integer("quantity").notNull(),
    unitPrice: real("unit_price").notNull(),
    status: text("status", { enum: ORDER_STATUSES }).notNull().default("confirmed"),
    orderDate: text("order_date").notNull(),
    deliveryDate: text("delivery_date"),
    ...timestamps,
  },
  (t) => [
    index("orders_customer_idx").on(t.customerId),
    index("orders_product_idx").on(t.productId),
  ],
);

// ---------------------------------------------------------------------------
// Inventory (one row per product)
// ---------------------------------------------------------------------------
export const inventory = sqliteTable(
  "inventory",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id),
    onHand: integer("on_hand").notNull().default(0),
    reserved: integer("reserved").notNull().default(0),
    updatedAt: timestamp("updated_at").default(sql`(datetime('now'))`),
  },
  (t) => [uniqueIndex("inventory_product_unique").on(t.productId)],
);

// ---------------------------------------------------------------------------
// Installation capacity (monthly buckets)
// ---------------------------------------------------------------------------
export const capacityPeriods = sqliteTable(
  "capacity_periods",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    // 'YYYY-MM'
    month: text("month").notNull(),
    totalMinutes: integer("total_minutes").notNull(),
    bookedMinutes: integer("booked_minutes").notNull().default(0),
    updatedAt: timestamp("updated_at").default(sql`(datetime('now'))`),
  },
  (t) => [uniqueIndex("capacity_periods_month_unique").on(t.month)],
);

// ---------------------------------------------------------------------------
// Financial transactions
// ---------------------------------------------------------------------------
export const TRANSACTION_TYPES = ["cash", "receivable", "payment", "expense"] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export const financialTransactions = sqliteTable(
  "financial_transactions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    type: text("type", { enum: TRANSACTION_TYPES }).notNull(),
    amount: real("amount").notNull(),
    description: text("description").notNull(),
    date: text("date").notNull(),
    relatedEntityType: text("related_entity_type"),
    relatedEntityId: integer("related_entity_id"),
    createdAt: timestamp("created_at").default(sql`(datetime('now'))`),
  },
  (t) => [index("financial_transactions_type_idx").on(t.type)],
);

// ---------------------------------------------------------------------------
// Management settings (singleton row, id = 1)
// ---------------------------------------------------------------------------
export const SETTINGS_SINGLETON_ID = 1;

export const managementSettings = sqliteTable("management_settings", {
  id: integer("id").primaryKey(),
  targetProfitMargin: real("target_profit_margin").notNull(),
  minimumOperationalCash: real("minimum_operational_cash").notNull(),
  fixedShippingCost: real("fixed_shipping_cost").notNull(),
  shippingCostPerUnit: real("shipping_cost_per_unit").notNull(),
  capacityWarningThreshold: real("capacity_warning_threshold").notNull(),
  capacityCriticalThreshold: real("capacity_critical_threshold").notNull(),
  // JSON object: { [ruleKey]: boolean }
  alertToggles: text("alert_toggles").notNull(),
  updatedAt: timestamp("updated_at").default(sql`(datetime('now'))`),
});

// ---------------------------------------------------------------------------
// Business alerts
// ---------------------------------------------------------------------------
export const ALERT_SEVERITIES = ["info", "risk", "critical"] as const;
export type AlertSeverity = (typeof ALERT_SEVERITIES)[number];

export const ALERT_STATUSES = ["active", "acknowledged", "resolved"] as const;
export type AlertStatus = (typeof ALERT_STATUSES)[number];

export const businessAlerts = sqliteTable(
  "business_alerts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    ruleKey: text("rule_key").notNull(),
    severity: text("severity", { enum: ALERT_SEVERITIES }).notNull(),
    title: text("title").notNull(),
    message: text("message").notNull(),
    cause: text("cause").notNull(),
    impact: text("impact").notNull(),
    suggestedCorrection: text("suggested_correction").notNull(),
    entityType: text("entity_type"),
    entityId: integer("entity_id"),
    status: text("status", { enum: ALERT_STATUSES }).notNull().default("active"),
    createdAt: timestamp("created_at").default(sql`(datetime('now'))`),
    resolvedAt: text("resolved_at"),
  },
  (t) => [
    index("business_alerts_status_idx").on(t.status),
    index("business_alerts_entity_idx").on(t.entityType, t.entityId),
  ],
);

// ---------------------------------------------------------------------------
// Organizational events (append-only audit log)
// ---------------------------------------------------------------------------
export const organizationalEvents = sqliteTable(
  "organizational_events",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    timestamp: timestamp("timestamp").default(sql`(datetime('now'))`),
    eventType: text("event_type").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: integer("entity_id").notNull(),
    // JSON snapshots
    beforeState: text("before_state"),
    afterState: text("after_state"),
    reason: text("reason"),
    // JSON array of generated alerts at the time of the event
    generatedAlerts: text("generated_alerts").notNull().default("[]"),
    createdAt: timestamp("created_at").default(sql`(datetime('now'))`),
  },
  (t) => [
    index("organizational_events_entity_idx").on(t.entityType, t.entityId),
    index("organizational_events_type_idx").on(t.eventType),
  ],
);
