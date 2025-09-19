"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/app/core/utils/cn"

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large"
}

const LoadingSpinner = ({ size = "medium" }: LoadingSpinnerProps) => {
  return (
    <div className={cn("flex items-center justify-center", size === "small" && "h-5 w-5", size === "medium" && "h-6 w-6", size === "large" && "h-8 w-8")}>
      <Loader2 className="animate-spin" />
    </div>
  )
}

export default LoadingSpinner

