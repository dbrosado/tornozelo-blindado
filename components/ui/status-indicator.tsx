import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      status: {
        green:
          "bg-primary/20 text-primary border-primary/50 hover:bg-primary/30",
        yellow:
          "bg-warning/20 text-warning border-warning/50 hover:bg-warning/30",
        red:
          "bg-danger/20 text-danger border-danger/50 hover:bg-danger/30",
        neutral:
          "bg-grid text-text-muted border-grid hover:bg-blueprint",
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
        "bg-primary": status === "green",
        "bg-warning": status === "yellow",
        "bg-danger": status === "red",
        "bg-text-muted": status === "neutral",
      })} />
      {label || status?.toUpperCase()}
    </div>
  )
}

export { StatusIndicator, statusVariants }
