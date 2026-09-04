import { NextResponse } from "next/server";
import { orderRepository } from "@/lib/repositories/orders";
export const GET = () => NextResponse.json(orderRepository.list());
export async function POST(request: Request) { return NextResponse.json(orderRepository.create(await request.json()), { status: 201 }); }
