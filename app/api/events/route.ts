import { NextResponse } from "next/server";
import { eventRepository } from "@/lib/repositories/events";
export const GET = () => NextResponse.json(eventRepository.list());
