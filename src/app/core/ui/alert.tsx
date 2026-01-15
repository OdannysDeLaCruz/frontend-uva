"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from "lucide-react"
import { cn } from "@/app/core/utils/cn"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        error: "border-red-200 bg-red-50 text-red-800 [&>svg]:text-red-600",
        warning: "border-yellow-200 bg-yellow-50 text-yellow-800 [&>svg]:text-yellow-600",
        success: "border-green-200 bg-green-50 text-green-800 [&>svg]:text-green-600",
        info: "border-blue-200 bg-blue-50 text-blue-800 [&>svg]:text-blue-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof alertVariants> & {
      icon?: React.ReactNode
      dismissible?: boolean
      onDismiss?: () => void
    }
>(({ className, variant, icon, dismissible = false, onDismiss, children, ...props }, ref) => {
  // Determinar el icono basado en la variante si no se proporciona uno
  const alertIcon = React.useMemo(() => {
    if (icon) return icon

    switch (variant) {
      case "error":
        return <AlertCircle className="h-5 w-5" />
      case "warning":
        return <AlertTriangle className="h-5 w-5" />
      case "success":
        return <CheckCircle className="h-5 w-5" />
      case "info":
        return <Info className="h-5 w-5" />
      default:
        return null
    }
  }, [variant, icon])

  return (
    <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
      {alertIcon}
      <div className={cn("flex-1", dismissible && "pr-7")}>{children}</div>
      {dismissible && onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="absolute right-4 top-4 rounded-md p-1 text-foreground/50 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Cerrar alerta"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5 ref={ref} className={cn("mb-1 font-medium leading-none tracking-tight", className)} {...props} />
  ),
)
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
  ),
)
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
