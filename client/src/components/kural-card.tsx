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
      <Card className="w-full h-full relative overflow-hidden bg-white text-black shadow-none rounded-none">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: `url(${kural.backgroundImage})` }}
        />
        <CardContent className="h-full flex flex-col justify-center max-w-2xl mx-auto p-8 relative z-10">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Kural #{kural.number}</h2>
              <p className="text-xl font-medium whitespace-pre-line mb-6 text-gray-900">{kural.tamil}</p>
              <p className="text-lg text-gray-700">{kural.english}</p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-semibold mb-3">Modern Take</h3>
              {isLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : interpretation ? (
                <p className="text-lg italic text-gray-700">
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