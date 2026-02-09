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

  // Border color based on level rarity/color
  const borderColor = level.id === 5 ? "border-gold/50" : "border-white/10";
  const glowClass = level.id === 5 ? "shadow-glow-gold" : "";

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-chakra font-bold uppercase tracking-wider",
        "bg-zinc-900/80 backdrop-blur-md border",
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
          <span className={cn("font-bold font-chakra uppercase", currentLevel.color)}>
             {currentLevel.name}
          </span>
          <span className="text-xs">{currentLevel.emoji}</span>
        </div>
        {nextLevel && (
          <div className="flex items-center gap-2 text-zinc-500">
             <span className="font-chakra uppercase">{nextLevel.name}</span>
             <span className="opacity-50">{nextLevel.emoji}</span>
          </div>
        )}
      </div>

      {/* Progress Bar Container */}
      <div className="relative h-2 bg-zinc-900/50 rounded-full overflow-hidden border border-white/5">
        {/* Animated Fill */}
        <motion.div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full",
            "bg-gradient-to-r from-volt-dim to-volt",
            "shadow-[0_0_15px_rgba(163,230,53,0.4)]"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>

      {/* Days Left */}
      {nextLevel && daysToNext > 0 && (
        <div className="flex justify-end">
          <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">
            <span className="text-volt font-bold">{daysToNext}</span> dias restantes
          </p>
        </div>
      )}
      {!nextLevel && (
        <motion.p 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] text-gold text-center uppercase tracking-widest font-bold font-chakra shadow-glow-gold"
        >
          Nível Máximo Alcançado! 🏆
        </motion.p>
      )}
    </div>
  );
}
