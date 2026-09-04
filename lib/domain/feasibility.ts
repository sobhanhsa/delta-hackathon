import { evaluateDeal } from "./calculations";
import { getAvailableInventory } from "./inventory";
import { getRemainingCapacityHours } from "./capacity";
import type { DealMetrics, DomainState, FeasibilityStatus } from "./types";

export function computeFeasibilityStatus(input: {
  remainingInventoryAfter: number;
  remainingCapacityAfter: number;
  margin: number;
  targetMarginPercent: number;
}): FeasibilityStatus {
  if (input.remainingInventoryAfter < 0 || input.remainingCapacityAfter < 0) return "غیرقابل انجام در شرایط فعلی";
  return input.margin < input.targetMarginPercent ? "مشروط" : "قابل انجام";
}

export function evaluateOpportunity(input: {
  quantity: number;
  unitPrice: number;
  productId: string;
  alreadyConfirmed?: boolean;
}, state: DomainState): (DealMetrics & {
  status: FeasibilityStatus;
  remainingInventoryAfter: number;
  remainingCapacityAfter: number;
  availableNow: number;
  remainingCapacityNow: number;
}) | null {
  const product = state.products.find(({ id }) => id === input.productId);
  if (!product) return null;
  const deal = evaluateDeal({ ...input, product, settings: state.settings });
  const availableNow = getAvailableInventory(state, product.id);
  const remainingCapacityNow = getRemainingCapacityHours(state);
  const confirmed = input.alreadyConfirmed ?? false;
  return {
    ...deal,
    status: computeFeasibilityStatus({
      remainingInventoryAfter: confirmed ? availableNow : availableNow - input.quantity,
      remainingCapacityAfter: confirmed ? remainingCapacityNow : remainingCapacityNow - deal.installHours,
      margin: deal.margin,
      targetMarginPercent: state.settings.targetMarginPercent,
    }),
    remainingInventoryAfter: confirmed ? availableNow : availableNow - input.quantity,
    remainingCapacityAfter: confirmed ? remainingCapacityNow : remainingCapacityNow - deal.installHours,
    availableNow,
    remainingCapacityNow,
  };
}
