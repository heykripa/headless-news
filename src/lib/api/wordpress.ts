import {
  decodeHtmlEntities,
  processWordPressContent,
} from "@/lib/utils/content";
import { withCache } from "@/lib/utils/cache";

interface WordPressPost {
  id: number;
  title: string;
  published: string;
  excerpt: string;
  content: string;
  slug: string;
  category: string[];
  featured_image?: string;
}

interface Post {
  id: string;
  title: string;
  date: string;
  excerpt?: string;
  link?: string;
  slug?: string;
}

// Use local API route to avoid CORS issues
const API_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// WordPress site URL for constructing post links
const WP_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleDateString("en-US", options);
}

async function fetchPostsFromAPI(limit: number, categoryName?: string): Promise<Post[]> {
  let url = `${API_BASE_URL}/api/posts?per_page=${limit}`;
  if (categoryName) {
    url += `&category_name=${encodeURIComponent(categoryName)}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    // Let browser handle caching based on Cache-Control headers from API
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const posts: WordPressPost[] = await response.json();

  return posts.map((post) => ({
    id: post.id.toString(),
    title: decodeHtmlEntities(post.title),
    date: formatDate(post.published),
    excerpt: processWordPressContent(post.excerpt),
    link: `${WP_SITE_URL}/${post.slug.startsWith('/') ? post.slug.slice(1) : post.slug}`, // Construct link from slug
    slug: post.slug,
  }));
}

export async function fetchRecentPosts(
  limit: number = 6,
  options: { forceRefresh?: boolean } = {},
): Promise<Post[]> {
  try {
    const cacheKey = `client-posts-${limit}`;

    return await withCache(cacheKey, () => fetchPostsFromAPI(limit), {
      ttl: 3 * 60 * 1000, // 3 minutes client-side cache (shorter than server)
      forceRefresh: options.forceRefresh,
    });
  } catch (error) {
    console.error("Error fetching posts from WordPress:", error);
    // Return empty array if API fails - no dummy data
    return [];
  }
}

export async function fetchPostsByCategory(
  categoryName: string,
  limit: number = 6,
  options: { forceRefresh?: boolean } = {},
): Promise<Post[]> {
  try {
    const cacheKey = `client-posts-${limit}-${categoryName}`;

    return await withCache(cacheKey, () => fetchPostsFromAPI(limit, categoryName), {
      ttl: 3 * 60 * 1000, // 3 minutes client-side cache (shorter than server)
      forceRefresh: options.forceRefresh,
    });
  } catch (error) {
    console.error(`Error fetching posts for category ${categoryName}:`, error);
    // Return empty array if API fails - no dummy data
    return [];
  }
}

/**
 * Force refresh posts by clearing cache and fetching fresh data
 */
export async function refreshPosts(limit: number = 6): Promise<Post[]> {
  return fetchRecentPosts(limit, { forceRefresh: true });
}
