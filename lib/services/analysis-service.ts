import { computeImpact } from "@/lib/domain";
import type { DomainState } from "@/lib/domain";
export const analysisService = {
  opportunity: (input: { productId: string; quantity: number; unitPrice: number }, state: DomainState) =>
    computeImpact(input, state),
};
