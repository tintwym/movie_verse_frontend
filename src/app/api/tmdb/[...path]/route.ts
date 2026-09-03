import { NextRequest, NextResponse } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";

function getApiKey(): string {
  return (
    process.env.TMDB_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_TMDB_API_KEY?.trim() ||
    ""
  );
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const key = getApiKey();
  if (!key || key === "your_tmdb_api_key" || key === "test_key") {
    return NextResponse.json(
      { status_message: "TMDB API key is not configured on the server" },
      { status: 503 }
    );
  }

  const { path } = await context.params;
  const segments = path?.join("/") ?? "";
  const incoming = request.nextUrl.searchParams;
  const params = new URLSearchParams(incoming);
  params.set("api_key", key);

  const url = `${TMDB_BASE}/${segments}?${params.toString()}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ status_message: "TMDB proxy failed" }, { status: 502 });
  }
}
