import type { Cash } from "./types";

export function computeCashForecast(cash: Cash, days = 7, today = new Date()) {
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  let running = cash.balance;
  let minBalance = running;
  let minBalanceDate = start.toISOString().slice(0, 10);
  const upcomingReceipts = [];
  const upcomingPayments = [];

  for (let offset = 1; offset <= days; offset += 1) {
    const date = new Date(start);
    date.setDate(date.getDate() + offset);
    const dateKey = date.toISOString().slice(0, 10);
    const receipts = cash.receipts.filter((item) => item.date === dateKey);
    const payments = cash.payments.filter((item) => item.date === dateKey);
    upcomingReceipts.push(...receipts);
    upcomingPayments.push(...payments);
    running += receipts.reduce((sum, item) => sum + item.amount, 0);
    running -= payments.reduce((sum, item) => sum + item.amount, 0);
    if (running < minBalance) {
      minBalance = running;
      minBalanceDate = dateKey;
    }
  }

  return { currentBalance: cash.balance, projectedBalance: running, minBalance, minBalanceDate, upcomingReceipts, upcomingPayments };
}
