"use client";

import { cn } from "@/lib/utils";
import { LevelInfo } from "@/lib/data/levels";

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

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-chakra font-bold uppercase tracking-wider",
        "bg-carbon/80 border border-grid/50 backdrop-blur-sm",
        sizeClasses[size],
        level.color,
        className
      )}
    >
      <span className={emojiSize[size]}>{level.emoji}</span>
      {showName && <span>{level.name}</span>}
    </div>
  );
}

interface LevelProgressBarProps {
  currentLevel: LevelInfo;
  nextLevel: LevelInfo | null;
  progressPercent: number;
  daysToNext: number;
  className?: string;
}

export function LevelProgressBar({
  currentLevel,
  nextLevel,
  progressPercent,
  daysToNext,
  className
}: LevelProgressBarProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {/* Level Labels */}
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center gap-1.5">
          <span className={cn("font-bold", currentLevel.color)}>{currentLevel.emoji} {currentLevel.name}</span>
        </div>
        {nextLevel && (
          <div className="flex items-center gap-1.5 text-text-muted">
            <span>{nextLevel.emoji} {nextLevel.name}</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-grid/30 rounded-full overflow-hidden">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out",
            "bg-gradient-to-r from-primary/80 to-primary",
            "shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          )}
          style={{ width: `${progressPercent}%` }}
        />
        {/* Glow Effect */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-primary/30 blur-sm"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Days Left */}
      {nextLevel && daysToNext > 0 && (
        <p className="text-[10px] text-text-muted text-center uppercase tracking-widest">
          {daysToNext} dias para {nextLevel.name}
        </p>
      )}
      {!nextLevel && (
        <p className="text-[10px] text-primary text-center uppercase tracking-widest font-bold">
          Nível Máximo Alcançado! 🏆
        </p>
      )}
    </div>
  );
}
