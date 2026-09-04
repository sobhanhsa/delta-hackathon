import type {
  AlertRuleKey,
  BusinessSettings,
  DomainAlert,
} from "./types";
import { availableInventory, remainingCapacityMinutes } from "./inventory-capacity-cash";

export interface AlertEvaluationInput {
  productName: string;
  quantity: number;
  onHand: number;
  reserved: number;
  safetyStock: number;
  profitMarginValue: number;
  operatingProfitValue: number;
  totalCapacityMinutes: number;
  bookedCapacityMinutes: number;
  requiredCapacityMinutes: number;
  capacityUtilizationValue: number;
  projectedCashValue: number;
  settings: BusinessSettings;
}

function ruleEnabled(settings: BusinessSettings, ruleKey: AlertRuleKey): boolean {
  return settings.alertToggles[ruleKey] !== false;
}

/**
 * Evaluates all alert rules against a scenario. Every threshold comes from
 * management settings — nothing is hardcoded. Disabled rules are skipped.
 */
export function evaluateAlerts(input: AlertEvaluationInput): DomainAlert[] {
  const { settings } = input;
  const alerts: DomainAlert[] = [];
  const available = availableInventory({ onHand: input.onHand, reserved: input.reserved });
  const remainingCapacity = remainingCapacityMinutes({
    month: "",
    totalMinutes: input.totalCapacityMinutes,
    bookedMinutes: input.bookedCapacityMinutes,
  });

  if (ruleEnabled(settings, "inventoryShortage") && input.quantity > available) {
    alerts.push({
      ruleKey: "inventoryShortage",
      severity: "critical",
      title: "Inventory shortage",
      message: `Requested ${input.quantity} units of ${input.productName} but only ${available} are available.`,
      cause: `Available stock (${available}) is lower than the requested quantity (${input.quantity}).`,
      impact: `The sale cannot be fulfilled from stock; shortfall of ${input.quantity - available} units.`,
      suggestedCorrection:
        "Reduce the quantity, restock the product, or unreserve stock from other commitments.",
    });
  }

  if (
    ruleEnabled(settings, "safetyStockViolation") &&
    input.quantity <= available &&
    available - input.quantity < input.safetyStock
  ) {
    alerts.push({
      ruleKey: "safetyStockViolation",
      severity: "risk",
      title: "Safety stock violation",
      message: `Selling ${input.quantity} units of ${input.productName} leaves ${available - input.quantity} in stock, below the safety stock of ${input.safetyStock}.`,
      cause: `Post-sale stock (${available - input.quantity}) falls below the product's safety stock (${input.safetyStock}).`,
      impact: "No buffer remains for unexpected demand or supply delays.",
      suggestedCorrection: "Reduce the quantity or schedule a restock before fulfilling this sale.",
    });
  }

  if (
    ruleEnabled(settings, "capacityShortage") &&
    input.requiredCapacityMinutes > remainingCapacity
  ) {
    alerts.push({
      ruleKey: "capacityShortage",
      severity: "critical",
      title: "Installation capacity shortage",
      message: `This sale needs ${input.requiredCapacityMinutes} installation minutes but only ${remainingCapacity} remain in the period.`,
      cause: `Required installation time (${input.requiredCapacityMinutes} min) exceeds remaining capacity (${remainingCapacity} min).`,
      impact: "The installation cannot be scheduled within the period.",
      suggestedCorrection:
        "Move the installation to a later period, add capacity, or reduce the quantity.",
    });
  }

  if (
    ruleEnabled(settings, "capacityPressure") &&
    input.requiredCapacityMinutes <= remainingCapacity &&
    input.capacityUtilizationValue >= settings.capacityWarningThreshold
  ) {
    const critical = input.capacityUtilizationValue >= settings.capacityCriticalThreshold;
    alerts.push({
      ruleKey: "capacityPressure",
      severity: critical ? "critical" : "risk",
      title: "Installation capacity pressure",
      message: `Capacity utilization would reach ${input.capacityUtilizationValue}% (threshold: ${settings.capacityWarningThreshold}%).`,
      cause: `Booked installation time after this sale reaches ${input.capacityUtilizationValue}% of the period's capacity.`,
      impact: "Little room remains for additional installations in this period.",
      suggestedCorrection: "Plan extra capacity or spread installations across periods.",
    });
  }

  if (
    ruleEnabled(settings, "marginBelowTarget") &&
    input.profitMarginValue < settings.targetProfitMargin
  ) {
    const loss = input.operatingProfitValue < 0;
    alerts.push({
      ruleKey: "marginBelowTarget",
      severity: loss ? "critical" : "risk",
      title: "Profit margin below target",
      message: `Profit margin of ${input.profitMarginValue}% is below the target of ${settings.targetProfitMargin}%.`,
      cause: `At this price and cost structure the deal earns ${input.profitMarginValue}% (target: ${settings.targetProfitMargin}%).`,
      impact: loss
        ? `The deal loses money (operating profit ${input.operatingProfitValue}).`
        : "The deal underperforms the profitability target.",
      suggestedCorrection: "Raise the unit price, lower costs, or increase the quantity.",
    });
  }

  if (
    ruleEnabled(settings, "cashBelowMinimum") &&
    input.projectedCashValue < settings.minimumOperationalCash
  ) {
    alerts.push({
      ruleKey: "cashBelowMinimum",
      severity: "critical",
      title: "Cash below minimum operational level",
      message: `Projected cash of ${input.projectedCashValue} is below the minimum operational cash of ${settings.minimumOperationalCash}.`,
      cause: "Expected cash movements push the balance under the configured safety floor.",
      impact: "The business may be unable to cover operational expenses.",
      suggestedCorrection: "Collect receivables sooner, delay expenses, or secure short-term financing.",
    });
  }

  return alerts;
}
