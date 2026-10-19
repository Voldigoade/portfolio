import { NextResponse } from "next/server";
import { getGithubRepos } from "@/lib/server/portfolio-data";

export async function GET() {
  const repos = await getGithubRepos();
  return NextResponse.json(repos);
}
