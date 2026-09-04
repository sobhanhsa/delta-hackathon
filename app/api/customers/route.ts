import { NextResponse } from "next/server";
import { customerService } from "@/lib/services";
export const GET = () => NextResponse.json(customerService.list());
export async function POST(request: Request) {
  return NextResponse.json(customerService.create(await request.json()), { status: 201 });
}
