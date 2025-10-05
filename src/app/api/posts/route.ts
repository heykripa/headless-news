import { type NextRequest, NextResponse } from "next/server";
import { withCache } from "@/lib/utils/cache";

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

async function fetchWordPressPosts(url: string, headers: HeadersInit) {
  const response = await fetch(url, {
    method: "GET",
    headers,
    cache: "no-store", // Disable Next.js caching, we handle our own
  });

  if (!response.ok) {
    throw new Error(`WordPress API error: ${response.status}`);
  }

  return response.json();
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
    const perPage = searchParams.get("per_page") || "8";
    const categoryName = searchParams.get("category_name");
    const forceRefresh = searchParams.get("refresh") === "true";

    // Create cache key based on parameters
    const cacheKey = `wp-posts-${perPage}${categoryName ? `-${categoryName}` : ''}`;
    
    // Build URL with optional category filter
    let url = `${WP_API_URL}/posts?per_page=${perPage}`;
    if (categoryName) {
      url += `&category_name=${encodeURIComponent(categoryName)}`;
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Add authentication header if credentials are available
    const authHeader = createAuthHeader();
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    // Use cache wrapper with 5-minute TTL
    const posts = await withCache(
      cacheKey,
      () => fetchWordPressPosts(url, headers),
      {
        ttl: 5 * 60 * 1000, // 5 minutes
        forceRefresh,
      },
    );

    // Return the posts with CORS headers
    return NextResponse.json(posts, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
        "Cache-Control": "public, max-age=300", // Browser cache for 5 minutes
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
