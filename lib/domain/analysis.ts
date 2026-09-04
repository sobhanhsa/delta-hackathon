import type { OpportunityStatus } from "./types";
import type { DomainAlert } from "./alerts";
import type { BusinessSettings } from "./types";
import { roundMoney } from "./calculations";
import { availableInventory, remainingCapacityMinutes } from "./inventory-capacity-cash";
import { determineFeasibility } from "./feasibility";
import { evaluateAlerts } from "./alerts";
import { analyzeOpportunityImpact } from "./impact";

/**
 * Builds the business state snapshot from repositories.
 */
export function buildBusinessStateSnapshot(
  inventory: { onHand: number; reserved: number },
  capacity: { month: string; totalMinutes: number; bookedMinutes: number },
  cash: { balance: number; pendingDelta: number },
  settings: BusinessSettings,
): {
  inventory: InventoryFacts;
  capacity: CapacityFacts;
  cash: CashFacts;
  feasibility: Feasibility;
  alerts: DomainAlert[];
} {
  const { onHand, reserved } = inventory;
  const { month, totalMinutes, bookedMinutes } = capacity;
  const { balance, pendingDelta } = cash;

  const available = availableInventory({ onHand, reserved });
  const remainingCapacity = remainingCapacityMinutes({
    month,
    totalMinutes,
    bookedMinutes,
  });

  const alerts = evaluateAlerts({
    productName: "",
    quantity: 0,
    onHand,
    reserved,
    safetyStock: 0,
    profitMarginValue: 0,
    operatingProfitValue: 0,
    totalCapacityMinutes: totalMinutes,
    bookedCapacityMinutes: bookedMinutes,
    requiredCapacityMinutes: 0,
    capacityUtilizationValue: 0,
    projectedCashValue: balance + pendingDelta,
    settings,
  });

  const feasibility = determineFeasibility(alerts);

  return {
    inventory: { onHand, reserved, available },
    capacity: { month, totalMinutes, bookedMinutes, remaining: remainingCapacity },
    cash: { balance, pendingDelta },
    feasibility,
    alerts,
  };
}
