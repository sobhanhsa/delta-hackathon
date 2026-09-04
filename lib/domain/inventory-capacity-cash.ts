import type { CapacityFacts, CashFacts, InventoryFacts } from "./types";
import { round2, roundMoney } from "./calculations";

/** Available Inventory = on hand − reserved for confirmed commitments. */
export function availableInventory(inventory: InventoryFacts): number {
  return inventory.onHand - inventory.reserved;
}

/**
 * Remaining inventory after selling `quantity` units.
 * Negative means a shortage — allowed as an analysis result (warning, not error).
 */
export function remainingInventoryAfterSale(
  inventory: InventoryFacts,
  quantity: number,
): number {
  return availableInventory(inventory) - quantity;
}

/** Remaining Capacity = total minutes − booked minutes. */
export function remainingCapacityMinutes(capacity: CapacityFacts): number {
  return capacity.totalMinutes - capacity.bookedMinutes;
}

/**
 * Capacity Utilization = (booked + additional required) ÷ total × 100.
 * Can exceed 100 (overbooked) — that is an analysis result, not an error.
 */
export function capacityUtilization(
  capacity: CapacityFacts,
  additionalMinutes: number,
): number {
  if (capacity.totalMinutes <= 0) return 0;
  return round2(((capacity.bookedMinutes + additionalMinutes) / capacity.totalMinutes) * 100);
}

/** Cash Balance = sum of signed transaction amounts. */
export function cashBalance(amounts: number[]): number {
  return roundMoney(amounts.reduce((sum, amount) => sum + amount, 0));
}

/** Projected Cash Balance = current balance + pending signed delta. */
export function projectedCashBalance(cash: CashFacts): number {
  return roundMoney(cash.balance + cash.pendingDelta);
}

/** Minimum projected cash across a series of cumulative deltas. */
export function minimumProjectedCash(balance: number, cumulativeDeltas: number[]): number {
  let min = balance;
  for (const delta of cumulativeDeltas) {
    min = Math.min(min, roundMoney(balance + delta));
  }
  return min;
}
