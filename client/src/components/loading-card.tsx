import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingCard() {
  return (
    <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-24 mb-4" />
              <Skeleton className="h-16" />
            </div>
            <div className="border-t pt-4">
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
