import type { DealMetrics, Product, Settings } from "./types";

export const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
export const priceFromDiscount = (basePrice: number, discountPercent: number) =>
  round2(basePrice * (1 - discountPercent / 100));
export const discountFromPrice = (basePrice: number, unitPrice: number) =>
  basePrice ? round2((1 - unitPrice / basePrice) * 100) : 0;
export const computeRevenue = (quantity: number, unitPrice: number) => quantity * unitPrice;
export const computeCogs = (quantity: number, unitCost: number) => quantity * unitCost;
export const computeShipping = (quantity: number, settings: Settings) =>
  settings.shippingFlatFee + settings.shippingPerUnitFee * quantity;
export const computeInstallHours = (quantity: number, minutesPerUnit: number) =>
  (quantity * minutesPerUnit) / 60;
export const computeProfit = (revenue: number, cogs: number, shipping: number) =>
  revenue - cogs - shipping;
export const computeMargin = (profit: number, revenue: number) => revenue ? (profit / revenue) * 100 : 0;

export function evaluateDeal(input: {
  quantity: number;
  unitPrice: number;
  product: Product;
  settings: Settings;
}): DealMetrics {
  const revenue = computeRevenue(input.quantity, input.unitPrice);
  const cogs = computeCogs(input.quantity, input.product.unitCost);
  const shipping = computeShipping(input.quantity, input.settings);
  const profit = computeProfit(revenue, cogs, shipping);
  return {
    revenue,
    cogs,
    shipping,
    profit,
    margin: computeMargin(profit, revenue),
    installHours: computeInstallHours(input.quantity, input.product.installMinutesPerUnit),
  };
}
