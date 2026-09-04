import { NextResponse } from "next/server";
import { settingsService } from "@/lib/services";
export const GET = () => NextResponse.json(settingsService.get() ?? null);
export async function PATCH(request: Request) {
  return NextResponse.json(settingsService.upsert(await request.json()));
}
