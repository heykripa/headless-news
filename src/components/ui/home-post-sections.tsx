"use client";

import { PostsList } from "./posts-list";
import { PostsSkeleton } from "./posts-skeleton";
import { fetchPostsByCategory } from "@/lib/api/wordpress";
import { useEffect, useState } from "react";

interface Post {
  id: string;
  title: string;
  date: string;
  excerpt?: string;
  link?: string;
  slug?: string;
}

interface CategorySection {
  categoryName: string;
  displayName: string;
  posts: Post[];
  loading: boolean;
}

interface Category {
  slug: string;
  displayName: string;
}

interface HomePostSectionsProps {
  categories: Category[];
  title?: string;
}

export function HomePostSections({ categories, title }: HomePostSectionsProps) {
  const [sections, setSections] = useState<CategorySection[]>(
    categories.map(cat => ({
      categoryName: cat.slug,
      displayName: cat.displayName,
      posts: [],
      loading: true,
    }))
  );

  useEffect(() => {
    async function loadAllSections() {
      // Load posts for each category
      const promises = categories.map(async (category) => {
        try {
          const posts = await fetchPostsByCategory(category.slug, 6);
          return {
            categoryName: category.slug,
            displayName: category.displayName,
            posts,
            loading: false,
          };
        } catch (error) {
          console.error(`Failed to load posts for ${category.slug}:`, error);
          return {
            categoryName: category.slug,
            displayName: category.displayName,
            posts: [],
            loading: false,
          };
        }
      });

      const results = await Promise.all(promises);
      setSections(results);
    }

    loadAllSections();
  }, [categories]);

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map((section) => (
          <div key={section.categoryName} className="flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {section.displayName}
            </h2>
            {section.loading ? (
              <PostsSkeleton count={6} />
            ) : section.posts.length > 0 ? (
              <PostsList posts={section.posts} />
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No posts available for {section.displayName}.</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}