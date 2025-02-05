import { useQuery } from "@tanstack/react-query";
import { ScrollContainer } from "@/components/scroll-container";
import type { Kural } from "@shared/schema";

export default function Home() {
  const { data: kurals, isLoading } = useQuery<Kural[]>({
    queryKey: ["/api/kurals"],
  });

  return (
    <main className="min-h-screen bg-background">
      <ScrollContainer
        kurals={kurals || []}
        isLoading={isLoading}
      />
    </main>
  );
}
