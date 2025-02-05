import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { Kural } from "@shared/schema";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface KuralCardProps {
  kural: Kural;
  isVisible: boolean;
}

interface InterpretationResponse {
  interpretation: string;
}

export function KuralCard({ kural, isVisible }: KuralCardProps) {
  const { data: interpretationData, isLoading } = useQuery<InterpretationResponse>({
    queryKey: [`/api/kurals/${kural.number}/interpretation`],
    enabled: isVisible && !kural.aiInterpretation,
    staleTime: Infinity, // Once we have an interpretation, keep it
    gcTime: Infinity,
    retry: 3, // Increase retry attempts
    retryDelay: 1000, // Wait 1 second between retries
  });

  const interpretation = kural.aiInterpretation || interpretationData?.interpretation;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeInOut"
      }}
      className="w-full h-full flex items-center justify-center bg-background"
    >
      <Card className="w-full h-full relative overflow-hidden bg-gradient-to-br from-background to-background/50 shadow-none rounded-none border-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-[0.03] mix-blend-overlay transition-opacity duration-500"
          style={{ backgroundImage: `url(${kural.backgroundImage})` }}
        />
        <CardContent className="h-full flex flex-col justify-center max-w-3xl mx-auto px-6 py-8 md:px-12 relative z-10">
          <div className="space-y-8 scrollbar-hide">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-primary/80">Thirukkural</span>
                  <Badge variant="outline" className="text-xs">
                    {kural.section}
                  </Badge>
                </div>
                <div className="flex items-end gap-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">#{kural.number}</h2>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-xl md:text-2xl font-medium leading-relaxed whitespace-pre-line text-foreground font-serif">{kural.tamil}</p>
                <p className="text-base md:text-lg leading-relaxed text-muted-foreground">{kural.english}</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-start">
                <span className="pr-3 bg-gradient-to-br from-background to-background/50 text-sm font-medium text-primary/80">
                  Modern Interpretation
                </span>
              </div>
            </div>

            <div className="pl-4 border-l-2 border-primary/20">
              {isLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              ) : interpretation ? (
                <p className="text-lg md:text-xl leading-relaxed text-foreground/90 italic">
                  {interpretation}
                </p>
              ) : (
                <p className="text-base md:text-lg text-muted-foreground">
                  Generating a modern interpretation...
                </p>
              )}
            </div>
          </div>

          <motion.div 
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-muted-foreground"
            initial={{ opacity: 0.5, y: 0 }}
            animate={{ 
              opacity: [0.5, 1, 0.5],
              y: [0, 5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}