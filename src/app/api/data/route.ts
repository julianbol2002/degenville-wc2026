import { NextResponse } from "next/server";
import { getAppData } from "@/lib/data";

export const revalidate = 60;

export async function GET() {
  const data = await getAppData();
  return NextResponse.json(data);
}
