import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Kural } from "@shared/schema";
import { KuralCard } from "./kural-card";
import { LoadingCard } from "./loading-card";

interface ScrollContainerProps {
  kurals: Kural[];
  isLoading: boolean;
}

export function ScrollContainer({ kurals, isLoading }: ScrollContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollPosition = container.scrollTop;
    const cardHeight = container.clientHeight;
    const newIndex = Math.floor(scrollPosition / cardHeight);

    // Only update if we have a valid new index
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < kurals.length) {
      setCurrentIndex(newIndex);
    }
  }, [currentIndex, kurals.length]);

  // Smooth scroll to a specific kural
  const scrollToKural = useCallback((index: number) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const targetPosition = index * container.clientHeight;

    container.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && currentIndex < kurals.length - 1) {
        e.preventDefault();
        scrollToKural(currentIndex + 1);
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        e.preventDefault();
        scrollToKural(currentIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, kurals.length, scrollToKural]);

  if (isLoading || kurals.length === 0) {
    return <LoadingCard />;
  }

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      onScroll={handleScroll}
    >
      <AnimatePresence>
        {kurals.map((kural, index) => (
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
      </AnimatePresence>
    </div>
  );
}