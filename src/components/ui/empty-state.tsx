import { FileX, Newspaper } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: "file" | "newspaper";
  className?: string;
}

export function EmptyState({ 
  title = "No content available", 
  description = "There are no items to display at the moment.",
  icon = "file",
  className = ""
}: EmptyStateProps) {
  const IconComponent = icon === "newspaper" ? Newspaper : FileX;
  
  return (
    <Card className={`shadow-none border-dashed border-2 ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-8 px-4 text-center">
        <div className="mb-4 p-3 rounded-full bg-muted/50">
          <IconComponent className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-medium text-foreground mb-1">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}