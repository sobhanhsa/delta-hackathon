import { NextResponse } from "next/server";
import { productService } from "@/lib/services";
export const GET = () => NextResponse.json(productService.list());
export async function POST(request: Request) {
  return NextResponse.json(productService.create(await request.json()), { status: 201 });
}
