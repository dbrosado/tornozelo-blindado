import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold font-heading transition-colors",
  {
    variants: {
      status: {
        green:
          "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30",
        yellow:
          "bg-amber-500/15 text-amber-500 border-amber-500/30",
        red:
          "bg-red-500/15 text-red-500 border-red-500/30",
        neutral:
          "bg-[#1A1A1A] text-[#A3A3A3] border-[#333333]",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-base",
      },
    },
    defaultVariants: {
      status: "neutral",
      size: "md",
    },
  }
)

export interface StatusIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusVariants> {
  label?: string
}

function StatusIndicator({ className, status, size, label, ...props }: StatusIndicatorProps) {
  return (
    <div className={cn(statusVariants({ status, size }), className)} {...props}>
      <span className={cn("mr-1.5 h-2 w-2 rounded-full", {
        "bg-[#10B981]": status === "green",
        "bg-amber-500": status === "yellow",
        "bg-red-500": status === "red",
        "bg-[#A3A3A3]": status === "neutral",
      })} />
      {label || status?.toUpperCase()}
    </div>
  )
}

export { StatusIndicator, statusVariants }
