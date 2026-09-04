/**
 * Centralized business calculations.
 *
 * Pure functions only. Every business-impacting parameter (prices, costs,
 * shipping rates, thresholds) is passed in — nothing is hardcoded here.
 */

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Revenue = quantity × unit price */
export function revenue(quantity: number, unitPrice: number): number {
  return roundMoney(quantity * unitPrice);
}

/** Product Cost = quantity × unit cost */
export function productCost(quantity: number, unitCost: number): number {
  return roundMoney(quantity * unitCost);
}

/** Shipping Cost = fixed shipping cost + (shipping cost per unit × quantity) */
export function shippingCost(
  fixedShippingCost: number,
  shippingCostPerUnit: number,
  quantity: number,
): number {
  return roundMoney(fixedShippingCost + shippingCostPerUnit * quantity);
}

/** Installation Hours = quantity × installation minutes per unit ÷ 60 */
export function installationHours(
  quantity: number,
  installationMinutesPerUnit: number,
): number {
  return round2((quantity * installationMinutesPerUnit) / 60);
}

/** Installation minutes needed (exact, no rounding to hours). */
export function installationMinutes(
  quantity: number,
  installationMinutesPerUnit: number,
): number {
  return quantity * installationMinutesPerUnit;
}

/** Operating Profit = revenue − product cost − shipping cost */
export function operatingProfit(
  revenueValue: number,
  productCostValue: number,
  shippingCostValue: number,
): number {
  return roundMoney(revenueValue - productCostValue - shippingCostValue);
}

/**
 * Profit Margin = operating profit ÷ revenue × 100
 *
 * Zero or negative revenue means the margin is meaningless; returns 0 and
 * callers should rely on operatingProfit (negative = loss) instead.
 */
export function profitMargin(operatingProfitValue: number, revenueValue: number): number {
  if (revenueValue <= 0) return 0;
  return round2((operatingProfitValue / revenueValue) * 100);
}
