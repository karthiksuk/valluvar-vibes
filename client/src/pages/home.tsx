import { useQuery } from "@tanstack/react-query";
import { ScrollContainer } from "@/components/scroll-container";
import type { Kural } from "@shared/schema";
import { useRoute, useLocation } from "wouter";
import { useEffect } from "react";

interface KuralsResponse {
  kurals: Kural[];
}

const LAST_VIEWED_KEY = 'lastViewedKural';

export default function Home() {
  const [, params] = useRoute('/kural/:number');
  const [, setLocation] = useLocation();

  const { data, isLoading } = useQuery<KuralsResponse>({
    queryKey: ["/api/kurals"],
  });

  // Get initial kural number from URL or localStorage
  const initialKuralNumber = params?.number 
    ? parseInt(params.number) 
    : parseInt(localStorage.getItem(LAST_VIEWED_KEY) || '1');

  // Save last viewed kural to localStorage
  const handleKuralChange = (kuralNumber: number) => {
    localStorage.setItem(LAST_VIEWED_KEY, kuralNumber.toString());
    if (!params?.number) {
      setLocation(`/kural/${kuralNumber}`);
    }
  };

  // Update URL when directly accessing with initialKuralNumber
  useEffect(() => {
    if (!params?.number && initialKuralNumber > 1) {
      setLocation(`/kural/${initialKuralNumber}`);
    }
  }, [params?.number, initialKuralNumber, setLocation]);

  return (
    <main className="min-h-screen bg-background">
      <ScrollContainer
        kurals={data?.kurals || []}
        isLoading={isLoading}
        initialKuralNumber={initialKuralNumber}
        onKuralChange={handleKuralChange}
      />
    </main>
  );
}