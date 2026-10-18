import { NextResponse } from "next/server";
import { getGithubOverview } from "@/lib/server/portfolio-data";

export async function GET() {
  const overview = await getGithubOverview();
  return NextResponse.json(overview);
}
