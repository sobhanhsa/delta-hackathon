export type Severity = "اطلاع" | "خطر" | "بحرانی";
export type FeasibilityStatus = "قابل انجام" | "مشروط" | "غیرقابل انجام در شرایط فعلی";

export interface Product {
  id: string;
  name: string;
  basePrice: number;
  unitCost: number;
  safetyStock: number;
  installMinutesPerUnit: number;
}

export interface Order {
  id: string;
  productId: string;
  quantity: number;
}

export interface Receipt { id: string; amount: number; date: string }
export interface Payment { id: string; amount: number; date: string }
export interface Expense { id: string; amount: number; date: string; description: string }

export interface Capacity {
  totalHours: number;
}

export interface Cash {
  balance: number;
  receipts: Receipt[];
  payments: Payment[];
  expenses: Expense[];
}

export interface Settings {
  targetMarginPercent: number;
  minOperatingCash: number;
  shippingFlatFee: number;
  shippingPerUnitFee: number;
  capacityThresholds: { info: number; warning: number; critical: number };
  inventoryAlertsEnabled: boolean;
  capacityAlertsEnabled: boolean;
  cashAlertsEnabled: boolean;
}

export interface DomainState {
  products: Product[];
  orders: Order[];
  inventory: Record<string, { available: number }>;
  capacity: Capacity;
  cash: Cash;
  settings: Settings;
}

export interface DealMetrics {
  revenue: number;
  cogs: number;
  shipping: number;
  profit: number;
  margin: number;
  installHours: number;
}

export interface Alert {
  id: string;
  title: string;
  severity: Severity;
  category: "موجودی" | "ظرفیت" | "مالی";
  reason: string;
  effect: string;
  suggestion: string;
}
