import type { BusinessSettings } from "./types";
import type { DomainAlert } from "./alerts";
import { buildBusinessStateSnapshot } from "./analysis";

export interface OpportunityImpactInput {
  product: ProductFacts;
  quantity: number;
  /** Optional price override; defaults to the product's price. */
  unitPrice?: number;
  inventory: InventoryFacts;
  capacity: CapacityFacts;
  cash: CashFacts;
  settings: BusinessSettings;
}

export interface OpportunityImpact {
  productId: number;
  quantity: number;
  unitPrice: number;
  revenue: number;
  productCost: number;
  shippingCost: number;
  operatingProfit: number;
  profitMargin: number;
  installationHours: number;
  availableInventory: number;
  remainingInventory: number;
  remainingCapacityMinutes: number;
  capacityUtilization: number;
  cashBalance: number;
  projectedCashBalance: number;
  feasibility: Feasibility;
  alerts: DomainAlert[];
}
