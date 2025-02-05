import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { Kural } from "@shared/schema";
import { KuralCard } from "./kural-card";
import { LoadingCard } from "./loading-card";

interface ScrollContainerProps {
  kurals: Kural[];
  hasMore: boolean;
  isLoading: boolean;
}

export function ScrollContainer({ kurals: initialKurals, hasMore: initialHasMore, isLoading: initialLoading }: ScrollContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [page, setPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [allKurals, setAllKurals] = useState<Kural[]>([]);

  // Initialize allKurals when initialKurals change
  useEffect(() => {
    if (initialKurals.length > 0) {
      setAllKurals(prevKurals => {
        // Only add new kurals that aren't already in the list
        const newKurals = initialKurals.filter(
          newKural => !prevKurals.some(existingKural => existingKural.id === newKural.id)
        );
        return [...prevKurals, ...newKurals];
      });
    }
  }, [initialKurals]);

  // Fetch next page of kurals
  const { data: nextPageData, isFetching } = useQuery<{ kurals: Kural[]; hasMore: boolean }>({
    queryKey: ["/api/kurals", { page: page + 1 }],
    enabled: currentIndex >= allKurals.length - 2 && initialHasMore,
  });

  // Update allKurals when new data arrives
  useEffect(() => {
    if (nextPageData?.kurals && !isFetching && currentIndex >= allKurals.length - 2) {
      setAllKurals(prev => {
        // Only add new kurals that aren't already in the list
        const newKurals = nextPageData.kurals.filter(
          newKural => !prev.some(existingKural => existingKural.id === newKural.id)
        );
        return [...prev, ...newKurals];
      });
      setPage(p => p + 1);
    }
  }, [nextPageData, isFetching, currentIndex, allKurals.length]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollPosition = container.scrollTop;
    const cardHeight = container.clientHeight;
    const newIndex = Math.floor(scrollPosition / cardHeight);

    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < allKurals.length) {
      setCurrentIndex(newIndex);

      // If we're near the end, this will trigger the next page fetch
      if (newIndex >= allKurals.length - 2) {
        console.log('Near end, should fetch more:', { newIndex, total: allKurals.length });
      }
    }
  }, [currentIndex, allKurals.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  if (initialLoading || allKurals.length === 0) {
    return <LoadingCard />;
  }

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory"
      onScroll={handleScroll}
    >
      <AnimatePresence>
        {allKurals.map((kural, index) => (
          <motion.div
            key={kural.id}
            className="snap-start h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <KuralCard
              kural={kural}
              isVisible={index === currentIndex}
            />
          </motion.div>
        ))}
        {isFetching && (
          <motion.div
            className="snap-start h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingCard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}