import { NextResponse } from "next/server";
import { inventoryRepository } from "@/lib/repositories/inventory";
export const GET = () => NextResponse.json(inventoryRepository.list());
export async function POST(request: Request) { return NextResponse.json(inventoryRepository.upsert(await request.json()), { status: 201 }); }
