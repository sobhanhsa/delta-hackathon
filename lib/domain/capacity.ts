import { computeInstallHours } from "./calculations";
import type { DomainState, Severity } from "./types";

export function getUsedCapacityHours(state: DomainState) {
  return state.orders.reduce((total, order) => {
    const product = state.products.find(({ id }) => id === order.productId);
    return product ? total + computeInstallHours(order.quantity, product.installMinutesPerUnit) : total;
  }, 0);
}

export function getRemainingCapacityHours(state: DomainState) {
  return state.capacity.totalHours - getUsedCapacityHours(state);
}

export function getCapacityUsagePercent(state: DomainState) {
  return state.capacity.totalHours ? (getUsedCapacityHours(state) / state.capacity.totalHours) * 100 : 0;
}

export function getCapacitySeverity(
  usagePercent: number,
  thresholds: DomainState["settings"]["capacityThresholds"],
): Severity | null {
  if (usagePercent >= thresholds.critical) return "بحرانی";
  if (usagePercent >= thresholds.warning) return "خطر";
  if (usagePercent >= thresholds.info) return "اطلاع";
  return null;
}
