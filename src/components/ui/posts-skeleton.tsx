import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

interface PostsSkeletonProps {
  count?: number;
}

export function PostsSkeleton({ count = 6 }: PostsSkeletonProps) {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <div className="space-y-0">
          {Array.from({ length: count }).map((_, index) => (
            <div key={index}>
              <div className="py-3">
                {/* Title skeleton - matches text-base font-semibold */}
                <Skeleton className="h-5 w-full mb-1" />
                {/* Date skeleton - matches text-xs */}
                <Skeleton className="h-3 w-32" />
              </div>
              {index < count - 1 && <Separator />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
