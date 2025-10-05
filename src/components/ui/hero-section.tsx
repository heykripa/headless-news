"use client";

import { PostsList } from "./posts-list";
import { PostsSkeleton } from "./posts-skeleton";
import { fetchRecentPosts } from "@/lib/api/wordpress";
import { useEffect, useState } from "react";

interface Post {
  id: string;
  title: string;
  date: string;
  excerpt?: string;
  link?: string;
}

export function HeroSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      try {
        const recentPosts = await fetchRecentPosts(8);
        setPosts(recentPosts);
      } catch (error) {
        console.error("Failed to load posts:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
      <div className="fluid-content">
        <h1 className="text-3xl font-bold mb-4">Latest News</h1>
        <p className="text-lg mb-6">
          Welcome to NewsKarnataka, your source for the latest news and updates
          from Karnataka and beyond.
        </p>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-3">Featured Story</h2>
          <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in
            dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.
          </p>
          <p>
            Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in
            nulla enim. Phasellus molestie magna non est bibendum non venenatis
            nisl tempor.
          </p>
        </div>
      </div>
      <div className="sidebar">
        <h2 className="text-xl font-semibold mb-4">Recent Updates</h2>
        {loading ? (
          <PostsSkeleton count={6} />
        ) : posts.length > 0 ? (
          <PostsList posts={posts} />
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p>No posts available at the moment.</p>
            <p className="text-sm mt-2">Please check your API configuration.</p>
          </div>
        )}
      </div>
    </div>
  );
}
