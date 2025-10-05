import { NextRequest, NextResponse } from "next/server";

const WP_API_URL = process.env.WP_API_URL;
const WP_USERNAME = process.env.WP_USERNAME;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

function createAuthHeader(): string {
  if (!WP_USERNAME || !WP_APP_PASSWORD) {
    return "";
  }
  const credentials = btoa(`${WP_USERNAME}:${WP_APP_PASSWORD}`);
  return `Basic ${credentials}`;
}

export async function GET(request: NextRequest) {
  try {
    if (!WP_API_URL) {
      return NextResponse.json(
        { error: "WordPress API URL not configured" },
        { status: 500 },
      );
    }

    // Get query parameters from the request
    const { searchParams } = new URL(request.url);
    const perPage = searchParams.get("per_page") || "6";

    const url = `${WP_API_URL}/posts?per_page=${perPage}`;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Add authentication header if credentials are available
    const authHeader = createAuthHeader();
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store", // Ensure fresh data
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `WordPress API error: ${response.status}` },
        { status: response.status },
      );
    }

    const posts = await response.json();

    // Return the posts with CORS headers
    return NextResponse.json(posts, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error fetching posts from WordPress:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 },
    );
  }
}
