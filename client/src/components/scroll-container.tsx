import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Kural } from "@shared/schema";
import { KuralCard } from "./kural-card";
import { LoadingCard } from "./loading-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Github } from "lucide-react";

interface ScrollContainerProps {
  kurals: Kural[];
  isLoading: boolean;
  initialKuralNumber?: number;
  onKuralChange?: (kuralNumber: number) => void;
}

export function ScrollContainer({
  kurals,
  isLoading,
  initialKuralNumber = 1,
  onKuralChange
}: ScrollContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [kuralNumber, setKuralNumber] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && kurals.length > 0 && initialKuralNumber > 1) {
      const index = kurals.findIndex(k => k.number === initialKuralNumber);
      if (index !== -1) {
        setCurrentIndex(index);
        const container = containerRef.current;
        if (container) {
          container.scrollTo({
            top: index * container.clientHeight,
            behavior: 'auto'
          });
        }
      }
    }
  }, [isLoading, kurals, initialKuralNumber]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollPosition = container.scrollTop;
    const cardHeight = container.clientHeight;
    const newIndex = Math.floor(scrollPosition / cardHeight);

    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < kurals.length) {
      setCurrentIndex(newIndex);
      onKuralChange?.(kurals[newIndex].number);
    }
  }, [currentIndex, kurals.length, onKuralChange, kurals]);

  const scrollToKural = useCallback((index: number) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const targetPosition = index * container.clientHeight;

    container.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }, []);

  const handleGoToKural = (e: React.FormEvent) => {
    e.preventDefault();
    const number = parseInt(kuralNumber);
    if (!number || number < 1 || number > kurals.length) {
      alert(`Please enter a valid kural number between 1 and ${kurals.length}`);
      return;
    }

    const index = kurals.findIndex(k => k.number === number);
    if (index !== -1) {
      scrollToKural(index);
      setIsDialogOpen(false);
      setKuralNumber("");
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

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
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
            <Button
              variant="outline"
              size="sm"
            >
              <Search className="w-4 h-4 mr-2" />
              Go to Kural
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Go to Kural</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleGoToKural} className="space-y-4">
            <Input
              type="number"
              placeholder="Enter kural number"
              min={1}
              max={kurals.length}
              value={kuralNumber}
              onChange={(e) => setKuralNumber(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Go
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <a
        href="https://github.com/tk120404/thirukkural"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-safe right-4 z-50 flex items-center gap-2 px-3 py-1.5 text-[10px] sm:text-xs bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors"
      >
        <Github className="w-3 h-3 sm:w-4 sm:h-4" />
        <span>Thirukkural Dataset Source</span>
      </a>

      <div className="fixed bottom-safe left-4 z-50 text-[10px] sm:text-xs text-gray-500">
        Developed by <a
          href="https://twitter.com/karthikeyansuku"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          @karthikeyansuku
        </a>
      </div>

      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-background scrollbar-hide pb-safe"
        onScroll={handleScroll}
      >
        <AnimatePresence>
          {kurals.map((kural, index) => (
            <motion.div
              key={kural.id}
              className="snap-start h-screen bg-background"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <KuralCard
                kural={kural}
                isVisible={index === currentIndex}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}