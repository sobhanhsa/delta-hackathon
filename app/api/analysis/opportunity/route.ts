import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { cash, capacity, inventory, orders, products, settings } from "@/lib/db/schema";
import { analysisService } from "@/lib/services";

const parse = <T>(value: string, fallback: T) => { try { return JSON.parse(value) as T; } catch { return fallback; } };
export async function POST(request: Request) {
  const input = await request.json() as { productId: string; quantity: number; unitPrice: number };
  const [productRows, orderRows, inventoryRows, capacityRows, cashRow, settingsRow] = await Promise.all([
    db.select().from(products).all(), db.select().from(orders).all(), db.select().from(inventory).all(),
    db.select().from(capacity).all(), db.select().from(cash).where(eq(cash.id, 1)).get(), db.select().from(settings).where(eq(settings.id, 1)).get(),
  ]);
  if (!settingsRow) return NextResponse.json({ error: "Settings are not configured" }, { status: 409 });
  const state = {
    products: productRows,
    orders: orderRows.map((order) => ({ id: order.id, productId: order.productId, quantity: order.quantity })),
    inventory: Object.fromEntries(inventoryRows.map((row) => [row.productId, { available: row.available }])),
    capacity: { totalHours: capacityRows.reduce((sum, row) => sum + row.totalHours, 0) },
    cash: { balance: cashRow?.balance ?? 0, receipts: parse(cashRow?.receiptsJson ?? "[]", []), payments: parse(cashRow?.paymentsJson ?? "[]", []), expenses: parse(cashRow?.expensesJson ?? "[]", []) },
    settings: { ...settingsRow, capacityThresholds: parse(settingsRow.capacityThresholdsJson, { info: 70, warning: 85, critical: 100 }) },
  };
  return NextResponse.json(analysisService.opportunity(input, state));
}
