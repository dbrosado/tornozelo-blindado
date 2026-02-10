"use client";

import { cn } from "@/lib/utils";
import { LevelInfo } from "@/lib/data/levels";
import { motion } from "framer-motion";

interface LevelBadgeProps {
  level: LevelInfo;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  className?: string;
}

export function LevelBadge({ level, size = "md", showName = true, className }: LevelBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2"
  };

  const emojiSize = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl"
  };

  const borderColor = level.id === 5 ? "border-amber-500/50" : "border-[#333333]";
  const glowClass = level.id === 5 ? "shadow-glow-warm" : "";

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-heading font-semibold uppercase tracking-wider",
        "bg-[#1A1A1A] shadow-neu-soft border",
        borderColor,
        glowClass,
        sizeClasses[size],
        level.color,
        className
      )}
    >
      <span className={emojiSize[size]}>{level.emoji}</span>
      {showName && <span>{level.name}</span>}
    </motion.div>
  );
}

interface LevelProgressBarProps {
  currentLevel: LevelInfo;
  nextLevel: LevelInfo | null;
  progressPercent: number;
  daysToNext?: number;
  className?: string;
}

export function LevelProgressBar({
  currentLevel,
  nextLevel,
  progressPercent,
  daysToNext = 0,
  className
}: LevelProgressBarProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Level Labels */}
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center gap-2">
          <span className={cn("font-semibold font-heading uppercase", currentLevel.color)}>
             {currentLevel.name}
          </span>
          <span className="text-xs">{currentLevel.emoji}</span>
        </div>
        {nextLevel && (
          <div className="flex items-center gap-2 text-[#666666]">
             <span className="font-heading uppercase">{nextLevel.name}</span>
             <span className="opacity-50">{nextLevel.emoji}</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 neu-inset rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full gradient-primary"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>

      {/* Days Left */}
      {nextLevel && daysToNext > 0 && (
        <div className="flex justify-end">
          <p className="text-[10px] text-[#A3A3A3] uppercase tracking-widest">
            <span className="text-[#10B981] font-semibold">{daysToNext}</span> dias restantes
          </p>
        </div>
      )}
      {!nextLevel && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] text-amber-500 text-center uppercase tracking-widest font-semibold font-heading"
        >
          Nivel Maximo Alcancado!
        </motion.p>
      )}
    </div>
  );
}
