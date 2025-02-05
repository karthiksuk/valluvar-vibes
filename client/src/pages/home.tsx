import { useQuery } from "@tanstack/react-query";
import { ScrollContainer } from "@/components/scroll-container";
import type { Kural } from "@shared/schema";

interface KuralsResponse {
  kurals: Kural[];
}

export default function Home() {
  const { data, isLoading } = useQuery<KuralsResponse>({
    queryKey: ["/api/kurals"],
  });

  return (
    <main className="min-h-screen bg-background">
      <ScrollContainer
        kurals={data?.kurals || []}
        isLoading={isLoading}
      />
    </main>
  );
}