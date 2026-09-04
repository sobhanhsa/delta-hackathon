import { NextResponse } from "next/server";
import { opportunityService } from "@/lib/services";
export const GET = () => NextResponse.json(opportunityService.list());
export async function POST(request: Request) {
  return NextResponse.json(opportunityService.create(await request.json()), { status: 201 });
}
