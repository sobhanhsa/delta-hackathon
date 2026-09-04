import type { DomainState, Product, Severity } from "./types";

export function getInventorySeverity(available: number, safetyStock: number): Severity | null {
  if (available < 0) return "بحرانی";
  if (available < safetyStock) return "خطر";
  if (available < safetyStock * 1.5) return "اطلاع";
  return null;
}

export function getAvailableInventory(state: DomainState, productId: string) {
  return state.inventory[productId]?.available ?? 0;
}

export function getInventoryImpact(state: DomainState, product: Product, quantity: number) {
  const available = getAvailableInventory(state, product.id);
  return { available, remaining: available - quantity, safetyStock: product.safetyStock };
}
