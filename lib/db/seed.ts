import { db } from "@/lib/db";
import { alerts, customers, events, opportunities, orders, products, inventory, capacity, cash, settings } from "@/lib/db/schema";

db.delete(events).run();
db.delete(alerts).run();
db.delete(opportunities).run();
db.delete(orders).run();
db.delete(inventory).run();
db.delete(capacity).run();
db.delete(cash).run();
db.delete(settings).run();
db.delete(customers).run();
db.delete(products).run();
db.insert(products).values([
  { id: "prod-standard", name: "محصول استاندارد", basePrice: 1200, unitCost: 700, safetyStock: 10, installMinutesPerUnit: 30 },
  { id: "prod-premium", name: "محصول پریمیوم", basePrice: 2200, unitCost: 1300, safetyStock: 5, installMinutesPerUnit: 60 },
  { id: "prod-service", name: "خدمات نصب", basePrice: 500, unitCost: 150, safetyStock: 0, installMinutesPerUnit: 90 },
]).run();
db.insert(customers).values(["آریا", "پارس", "نوآوران"].map((name, index) => ({ id: `customer-${index + 1}`, name }))).run();
db.insert(inventory).values([
  { productId: "prod-standard", available: 80 }, { productId: "prod-premium", available: 25 }, { productId: "prod-service", available: 100 },
]).run();
db.insert(capacity).values({ id: 1, totalHours: 160 }).run();
db.insert(cash).values({ id: 1, balance: 250000, receiptsJson: "[]", paymentsJson: "[]", expensesJson: "[]" }).run();
db.insert(settings).values({ id: 1, targetMarginPercent: 20, minOperatingCash: 50000, shippingFlatFee: 1000, shippingPerUnitFee: 10, capacityThresholdsJson: JSON.stringify({ info: 70, warning: 85, critical: 100 }) }).run();
console.log("Seed complete");
