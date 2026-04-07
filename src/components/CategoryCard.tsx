/**
 * CategoryCard - Displays a single category score with a progress bar.
 * Shows the category name, score, and detailed findings.
 */

import { motion } from "framer-motion";
import type { CategoryScore } from "@/lib/ethicsAnalyzer";
import { getScoreColor } from "@/lib/ethicsAnalyzer";

interface CategoryCardProps {
  category: CategoryScore;
  index: number; // Used to stagger animations
}

const CategoryCard = ({ category, index }: CategoryCardProps) => {
  const color = getScoreColor(category.score);

  const bgColorMap = {
    green: "bg-score-green",
    yellow: "bg-score-yellow",
    red: "bg-score-red",
  };

  const textColorMap = {
    green: "text-score-green",
    yellow: "text-score-yellow",
    red: "text-score-red",
  };

  return (
    <motion.div
      className="rounded-lg border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.15, duration: 0.5 }}
    >
      {/* Header: category name + score */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-foreground">{category.name}</h3>
        <span className={`text-lg font-bold font-mono ${textColorMap[color]}`}>
          {category.score}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground mb-3">{category.description}</p>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-secondary overflow-hidden mb-3">
        <motion.div
          className={`h-full rounded-full ${bgColorMap[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${category.score}%` }}
          transition={{ delay: 0.5 + index * 0.15, duration: 1, ease: "easeOut" }}
        />
      </div>

      {/* Details */}
      <p className="text-sm text-muted-foreground">{category.details}</p>
    </motion.div>
  );
};

export default CategoryCard;
