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
  const [hasMore, setHasMore] = useState(initialHasMore);

  // Initialize allKurals when initialKurals change
  useEffect(() => {
    if (initialKurals.length > 0) {
      setAllKurals(prevKurals => {
        const existingIds = new Set(prevKurals.map(k => k.id));
        const newKurals = initialKurals.filter(kural => !existingIds.has(kural.id));
        return [...prevKurals, ...newKurals];
      });
      setHasMore(initialHasMore);
    }
  }, [initialKurals, initialHasMore]);

  // Fetch next page of kurals
  const { data: nextPageData, isFetching } = useQuery({
    queryKey: ["/api/kurals", { page: page + 1 }],
    enabled: hasMore && currentIndex >= (allKurals.length - 5),
  });

  // Update allKurals when new data arrives
  useEffect(() => {
    if (nextPageData?.kurals && nextPageData?.hasMore !== undefined) {
      setAllKurals(prev => {
        const existingIds = new Set(prev.map(k => k.id));
        const newKurals = nextPageData.kurals.filter(kural => !existingIds.has(kural.id));
        return [...prev, ...newKurals];
      });
      setHasMore(nextPageData.hasMore);
      setPage(p => p + 1);
    }
  }, [nextPageData]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollPosition = container.scrollTop;
    const cardHeight = container.clientHeight;
    const newIndex = Math.floor(scrollPosition / cardHeight);

    // Only update if we have a valid new index
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < allKurals.length) {
      setCurrentIndex(newIndex);

      // Pre-fetch next page when we're getting close to the end
      if (hasMore && newIndex >= allKurals.length - 5) {
        console.log('Near end, should fetch more:', { 
          currentIndex: newIndex, 
          total: allKurals.length 
        });
      }
    }
  }, [currentIndex, allKurals.length, hasMore]);

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
        {(isFetching && hasMore) && (
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