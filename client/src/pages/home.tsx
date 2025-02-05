import { useQuery } from "@tanstack/react-query";
import { ScrollContainer } from "@/components/scroll-container";
import type { Kural } from "@shared/schema";

interface KuralsResponse {
  kurals: Kural[];
  hasMore: boolean;
}

export default function Home() {
  const { data, isLoading } = useQuery<KuralsResponse>({
    queryKey: ["/api/kurals", { page: 1 }],
  });

  return (
    <main className="min-h-screen bg-background">
      <ScrollContainer
        kurals={data?.kurals || []}
        hasMore={data?.hasMore || false}
        isLoading={isLoading}
      />
    </main>
  );
}