import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Post {
  id: string;
  title: string;
  date: string;
  excerpt?: string;
  link?: string;
  slug?: string;
}

interface PostsListProps {
  posts: Post[];
}

export function PostsList({ posts }: PostsListProps) {
  return (
    <Card className="shadow-none border rounded-sm py-0 overflow-hidden">
      <CardContent className="p-0">
        <div className="space-y-0">
          {posts.map((post, index) => (
            <div key={post.id}>
              {post.link ? (
                <a 
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-3 px-4 hover:bg-zinc-50 transition-colors group"
                >
                  <h3 className="text-base font-semibold mb-1 text-kannada whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-accent-foreground transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono">{post.date}</p>
                </a>
              ) : (
                <div className="py-3 px-4 hover:bg-zinc-50 transition-colors">
                  <h3 className="text-base font-semibold mb-1 text-kannada whitespace-nowrap overflow-hidden text-ellipsis">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono">{post.date}</p>
                </div>
              )}
              {index < posts.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
