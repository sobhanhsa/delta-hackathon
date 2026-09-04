import type { Feasibility } from "@/lib/db/schema";
import type { DomainAlert } from "./types";

/**
 * Feasibility is derived from the alerts a scenario produces:
 *  - any critical alert  → infeasible
 *  - any risk alert      → conditional
 *  - otherwise           → feasible
 *
 * Feasibility is informational. It never blocks persistence.
 */
export function determineFeasibility(alerts: DomainAlert[]): Feasibility {
  if (alerts.some((a) => a.severity === "critical")) return "infeasible";
  if (alerts.some((a) => a.severity === "risk")) return "conditional";
  return "feasible";
}
