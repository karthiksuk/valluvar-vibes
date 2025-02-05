import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import type { Kural } from "@shared/schema";

interface KuralCardProps {
  kural: Kural;
  isVisible: boolean;
}

export function KuralCard({ kural, isVisible }: KuralCardProps) {
  const { data: interpretationData, isLoading } = useQuery({
    queryKey: ["/api/kurals", kural.id, "interpretation"],
    enabled: isVisible && !kural.aiInterpretation
  });

  const interpretation = kural.aiInterpretation || interpretationData?.interpretation;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-[calc(100vh-4rem)] flex items-center justify-center p-4"
    >
      <Card className="w-full max-w-md relative overflow-hidden bg-white text-black">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: `url(${kural.backgroundImage})` }}
        />
        <CardContent className="p-6 relative z-10">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Kural #{kural.number}</h2>
              <p className="text-lg font-medium whitespace-pre-line mb-4">{kural.tamil}</p>
              <p className="text-gray-700">{kural.english}</p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-semibold mb-2">Modern Take</h3>
              {isLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : interpretation ? (
                <p className="italic text-gray-700">
                  {interpretation}
                </p>
              ) : (
                <p className="text-gray-500">
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