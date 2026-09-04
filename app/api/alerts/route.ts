import { NextResponse } from "next/server";
import { alertRepository } from "@/lib/repositories/alerts";
export const GET = () => NextResponse.json(alertRepository.list());
