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
}

// Use local API route to avoid CORS issues
const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  return date.toLocaleDateString('en-US', options);
}

export async function fetchRecentPosts(limit: number = 6): Promise<Post[]> {
  try {
    const url = `${API_BASE_URL}/api/posts?per_page=${limit}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Ensure fresh data
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const posts: WordPressPost[] = await response.json();

    return posts.map((post) => ({
      id: post.id.toString(),
      title: post.title,
      date: formatDate(post.published),
      excerpt: post.excerpt.replace(/<[^>]*>/g, ''), // Strip HTML tags
      link: `https://api-kn.newskarnataka.com/${post.slug}`, // Construct link from slug
    }));
  } catch (error) {
    console.error('Error fetching posts from WordPress:', error);
    // Return empty array if API fails - no dummy data
    return [];
  }
}