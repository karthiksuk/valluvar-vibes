import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { Kural } from "@shared/schema";

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
      className="w-full h-screen flex items-center justify-center p-0"
    >
      <Card className="w-full h-full relative overflow-hidden bg-gradient-to-br from-white to-gray-50 shadow-none rounded-none">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: `url(${kural.backgroundImage})` }}
        />
        <CardContent className="h-full flex flex-col justify-center max-w-3xl mx-auto p-12 relative z-10">
          <div className="space-y-12">
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-sm font-medium text-primary/80">Thirukkural</span>
                <h2 className="text-4xl font-bold text-gray-900">#{kural.number}</h2>
              </div>
              <div className="space-y-6">
                <p className="text-2xl font-medium leading-relaxed whitespace-pre-line text-gray-900 font-serif">{kural.tamil}</p>
                <p className="text-lg leading-relaxed text-gray-700">{kural.english}</p>
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
                <p className="text-xl leading-relaxed text-gray-800 italic">
                  {interpretation}
                </p>
              ) : (
                <p className="text-lg text-gray-500">
                  Generating a modern interpretation...
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}