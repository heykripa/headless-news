import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Post {
  id: string;
  title: string;
  date: string;
  excerpt?: string;
  link?: string;
}

interface PostsListProps {
  posts: Post[];
}

export function PostsList({ posts }: PostsListProps) {

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <div className="space-y-0">
          {posts.map((post, index) => (
            <div key={post.id}>
              <div className="py-3">
                <h3 className="text-base font-semibold mb-1 text-kannada">{post.title}</h3>
                <p className="text-xs text-gray-500 font-mono">{post.date}</p>
              </div>
              {index < posts.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}