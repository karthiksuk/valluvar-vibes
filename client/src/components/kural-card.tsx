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

export function KuralCard({ kural, isVisible }: KuralCardProps) {
  const { data: interpretationData, isLoading } = useQuery({
    queryKey: [`/api/kurals/${kural.id}/interpretation`],
    enabled: isVisible && !kural.aiInterpretation
  });

  const interpretation = kural.aiInterpretation || interpretationData?.interpretation;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex items-center justify-center"
    >
      <Card className="w-full h-full relative overflow-hidden bg-gradient-to-br from-white to-gray-50 shadow-none rounded-none">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-[0.03] mix-blend-overlay animate-gradient"
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
                  <Badge variant="outline" className="text-xs">
                    {kural.chapterGroup}
                  </Badge>
                </div>
                <div className="flex items-end gap-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">#{kural.number}</h2>
                  <p className="text-sm text-gray-600 pb-1">{kural.chapter}</p>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-xl md:text-2xl font-medium leading-relaxed whitespace-pre-line text-gray-900 font-serif">{kural.tamil}</p>
                <p className="text-base md:text-lg leading-relaxed text-gray-700">{kural.english}</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-start">
                <span className="pr-3 bg-gradient-to-br from-white to-gray-50 text-sm font-medium text-primary/80">
                  Modern Interpretation
                </span>
              </div>
            </div>

            <div className="pl-4 border-l-2 border-primary/20">
              {isLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : interpretation ? (
                <p className="text-lg md:text-xl leading-relaxed text-gray-800 italic">
                  {interpretation}
                </p>
              ) : (
                <p className="text-base md:text-lg text-gray-500">
                  Generating a modern interpretation...
                </p>
              )}
            </div>
          </div>

          <motion.div 
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-400"
            initial={{ opacity: 0.5 }}
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