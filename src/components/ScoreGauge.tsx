/**
 * ScoreGauge - A circular gauge that displays the ethics score.
 * Uses SVG to draw a circle that fills based on the score.
 * Color changes based on score range (green/yellow/red).
 */

import { motion } from "framer-motion";
import { getScoreColor, getScoreLabel } from "@/lib/ethicsAnalyzer";

interface ScoreGaugeProps {
  score: number;
}

const ScoreGauge = ({ score }: ScoreGaugeProps) => {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  // SVG circle math: circumference = 2 * π * radius
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  // How much of the circle to fill based on score
  const offset = circumference - (score / 100) * circumference;

  // Map color names to CSS variable classes
  const colorMap = {
    green: "stroke-score-green",
    yellow: "stroke-score-yellow",
    red: "stroke-score-red",
  };

  const textColorMap = {
    green: "text-score-green",
    yellow: "text-score-yellow",
    red: "text-score-red",
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          {/* Background circle (track) */}
          <circle
            cx="60" cy="60" r={radius}
            fill="none"
            strokeWidth="10"
            className="stroke-secondary"
          />
          {/* Animated score circle */}
          <motion.circle
            cx="60" cy="60" r={radius}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            className={colorMap[color]}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        {/* Score number in the center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`text-4xl font-bold font-mono ${textColorMap[color]}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            / 100
          </span>
        </div>
      </div>
      {/* Score label */}
      <motion.span
        className={`text-sm font-semibold uppercase tracking-widest ${textColorMap[color]}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {label}
      </motion.span>
    </div>
  );
};

export default ScoreGauge;
