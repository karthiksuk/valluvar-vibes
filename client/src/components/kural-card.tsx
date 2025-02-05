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
      <Card className="w-full h-full relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 shadow-none rounded-none">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-[0.03] mix-blend-overlay animate-gradient"
          style={{ backgroundImage: `url(${kural.backgroundImage})` }}
        />
        <CardContent className="h-full flex flex-col justify-center max-w-3xl mx-auto px-6 pb-24 pt-12 md:px-12 md:pb-32 relative z-10">
          <div className="space-y-8 scrollbar-hide">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-primary/80">Thirukkural</span>
                  <Badge 
                    variant="secondary"
                    className="text-xs font-medium bg-primary/10 text-primary/90 border border-primary/20 hover:bg-primary/15"
                  >
                    {kural.section}
                  </Badge>
                </div>
                <div className="flex items-end gap-4">
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-100">#{kural.number}</h2>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-xl md:text-2xl font-medium leading-relaxed whitespace-pre-line text-slate-200 font-serif">{kural.tamil}</p>
                <p className="text-base md:text-lg leading-relaxed text-slate-300">{kural.english}</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-start">
                <span className="pr-3 bg-gradient-to-br from-slate-900 to-slate-800 text-sm font-medium text-primary/80">
                  LLM Says ..
                </span>
              </div>
            </div>

            <div className="pl-4 border-l-2 border-primary/20">
              {isLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                </div>
              ) : interpretation ? (
                <p className="text-lg md:text-xl leading-relaxed text-slate-300 italic">
                  {interpretation}
                </p>
              ) : (
                <p className="text-base md:text-lg text-slate-400">
                  Generating a modern interpretation...
                </p>
              )}
            </div>
          </div>

          <motion.div 
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-slate-500 md:bottom-16"
            initial={{ opacity: 0.5 }}
            animate={{ 
              opacity: [0.5, 1, 0.5],
              y: [0, 5, 0]
            }}
            transition={{
              duration: 0.75,
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