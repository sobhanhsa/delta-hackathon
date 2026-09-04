import { computeCashForecast } from "./cash";
import { getCapacitySeverity, getCapacityUsagePercent, getRemainingCapacityHours } from "./capacity";
import { getInventorySeverity } from "./inventory";
import type { Alert, DomainState } from "./types";
import { round2 } from "./calculations";

export function computeAlerts(state: DomainState): Alert[] {
  const alerts: Alert[] = [];
  if (state.settings.inventoryAlertsEnabled) {
    for (const product of state.products) {
      const available = state.inventory[product.id]?.available ?? 0;
      const severity = getInventorySeverity(available, product.safetyStock);
      if (severity) {
        alerts.push({
          id: `inv-${product.id}`,
          title: `${severity} — موجودی ${product.name}`,
          severity,
          category: "موجودی",
          reason: `موجودی آزاد (${available}) کمتر از موجودی ایمن (${product.safetyStock}) است.`,
          effect: available < 0 ? `کسری ${Math.abs(available)} واحد.` : `فاصله تا موجودی ایمن: ${Math.max(product.safetyStock - available, 0)} واحد.`,
          suggestion: "کاهش تعداد فروش جدید، تغییر موعد تحویل یا اصلاح موجودی.",
        });
      }
    }
  }
  if (state.settings.capacityAlertsEnabled) {
    const usage = getCapacityUsagePercent(state);
    const severity = getCapacitySeverity(usage, state.settings.capacityThresholds);
    if (severity) {
      alerts.push({
        id: "capacity",
        title: `${severity} — مصرف ظرفیت نصب`,
        severity,
        category: "ظرفیت",
        reason: `مصرف ظرفیت نصب به ${round2(usage)}٪ رسیده است.`,
        effect: `ظرفیت باقی‌مانده: ${round2(getRemainingCapacityHours(state))} ساعت.`,
        suggestion: "افزایش ظرفیت نصب یا تغییر موعد سفارش‌های در صف.",
      });
    }
  }
  if (state.settings.cashAlertsEnabled) {
    const forecast = computeCashForecast(state.cash);
    if (forecast.minBalance < state.settings.minOperatingCash) {
      alerts.push({
        id: "cash",
        title: "بحرانی — کسری نقدینگی پیش‌بینی‌شده",
        severity: "بحرانی",
        category: "مالی",
        reason: `کمترین مانده نقد پیش‌بینی‌شده (${Math.round(forecast.minBalance)}) کمتر از حداقل نقد عملیاتی است.`,
        effect: `تاریخ کمترین مانده: ${forecast.minBalanceDate}.`,
        suggestion: "تسریع در وصول مطالبات یا تعویق پرداخت‌های غیرضروری.",
      });
    }
  }
  return alerts;
}
