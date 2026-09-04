import { evaluateOpportunity } from "./feasibility";
import type { DomainState } from "./types";

export function computeImpact(input: {
  productId: string;
  quantity: number;
  unitPrice: number;
}, state: DomainState) {
  const evaluation = evaluateOpportunity(input, state);
  if (!evaluation) return null;
  return {
    ...evaluation,
    inventoryDelta: -input.quantity,
    capacityDeltaHours: -evaluation.installHours,
    cashDelta: evaluation.profit,
  };
}
