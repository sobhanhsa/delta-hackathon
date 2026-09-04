import { NextResponse } from "next/server";
import { productService } from "@/lib/services";
type Context = { params: Promise<{ id: string }> };
export async function GET(_: Request, context: Context) {
  const result = productService.get((await context.params).id);
  return result ? NextResponse.json(result) : NextResponse.json({ error: "Not found" }, { status: 404 });
}
export async function PATCH(request: Request, context: Context) {
  const result = productService.update((await context.params).id, await request.json());
  return result ? NextResponse.json(result) : NextResponse.json({ error: "Not found" }, { status: 404 });
}
export async function DELETE(_: Request, context: Context) {
  const result = productService.remove((await context.params).id);
  return result ? NextResponse.json(result) : NextResponse.json({ error: "Not found" }, { status: 404 });
}
