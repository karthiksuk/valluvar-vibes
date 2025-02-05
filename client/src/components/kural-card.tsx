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
      <Card className="w-full max-w-md relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${kural.backgroundImage})` }}
        />
        <CardContent className="p-6 relative z-10">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Kural #{kural.number}</h2>
              <p className="text-lg font-medium whitespace-pre-line mb-4">{kural.tamil}</p>
              <p className="text-gray-600 dark:text-gray-400">{kural.english}</p>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">Modern Take</h3>
              {isLoading ? (
                <Skeleton className="h-20" />
              ) : (
                <p className="italic text-gray-700 dark:text-gray-300">
                  {interpretation || "Loading interpretation..."}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
