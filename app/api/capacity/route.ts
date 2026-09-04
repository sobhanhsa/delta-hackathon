import { NextResponse } from "next/server";
import { capacityRepository } from "@/lib/repositories/capacity";
export const GET = () => NextResponse.json(capacityRepository.list());
export async function POST(request: Request) { return NextResponse.json(capacityRepository.create(await request.json()), { status: 201 }); }
