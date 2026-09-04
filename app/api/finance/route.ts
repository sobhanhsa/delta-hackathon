import { NextResponse } from "next/server";
import { financeRepository } from "@/lib/repositories/finance";
export const GET = () => NextResponse.json(financeRepository.get() ?? null);
export async function POST(request: Request) { return NextResponse.json(financeRepository.upsert(await request.json()), { status: 201 }); }
