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
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollPosition = container.scrollTop;
    const cardHeight = container.clientHeight;
    const newIndex = Math.round(scrollPosition / cardHeight);

    // Only update if we have a valid new index
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < kurals.length) {
      setCurrentIndex(newIndex);

      // Set scrolling state with a shorter timeout
      setIsScrolling(true);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 50); // Reduced from 100ms to 50ms for even faster interpretation loading
    }
  }, [currentIndex, kurals.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        container.removeEventListener('scroll', handleScroll);
        if (scrollTimeout.current) {
          clearTimeout(scrollTimeout.current);
        }
      };
    }
  }, [handleScroll]);

  if (isLoading || kurals.length === 0) {
    return <LoadingCard />;
  }

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
      onScroll={handleScroll}
      style={{
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <AnimatePresence mode="wait">
        {kurals.map((kural, index) => (
          <motion.div
            key={kural.id}
            className="snap-start h-screen bg-background"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              transition: {
                duration: 0.5,
                ease: "easeInOut"
              }
            }}
            exit={{ 
              opacity: 0,
              transition: {
                duration: 0.3,
                ease: "easeInOut"
              }
            }}
          >
            <KuralCard
              kural={kural}
              isVisible={index === currentIndex && !isScrolling}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}