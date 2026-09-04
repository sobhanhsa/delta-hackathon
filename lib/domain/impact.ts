import { buildBusinessStateSnapshot } from "./analysis";
import type { BusinessSettings } from "./types";

/**
 * The analysis engine is the same for both preview and post-mutation impact.
 * It shares the same code path, never writes to DB, and is pure.
 */
export function analyzeOpportunityImpact(
  input: OpportunityImpactInput,
  stateSnapshot: { inventory: InventoryFacts; capacity: CapacityFacts; cash: CashFacts },
  settings: BusinessSettings,
): OpportunityImpact {
  const snapshot = buildBusinessStateSnapshot(input.inventory, input.capacity, input.cash, settings);
  const { feasibility, alerts } = snapshot;
  const inputImpact = analyzeOpportunityImpact(input, snapshot, settings);

  return {
    ...inputImpact,
    feasibility,
    alerts,
  };
}
