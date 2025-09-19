"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react'
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/app/core/utils/cn"
import { Button } from "@/app/core/ui/button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const alertDialogVariants = cva(
  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg",
  {
    variants: {
      variant: {
        default: "bg-background border-border",
        error: "border-red-200 bg-red-50",
        warning: "border-yellow-200 bg-yellow-50",
        success: "border-green-200 bg-green-50",
        info: "border-blue-200 bg-blue-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> & 
  VariantProps<typeof alertDialogVariants> & {
    showCloseButton?: boolean
    onClose?: () => void
  }
>(({ className, variant, showCloseButton = true, onClose, children, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(alertDialogVariants({ variant }), className)}
      {...props}
    >
      {children}
      {showCloseButton && (
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Cerrar</span>
        </button>
      )}
    </AlertDialogPrimitive.Content>
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm", className)}
    {...props}
  />
))
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      "mt-2 inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

// Componente de alerta modal completo
interface ServerAlertProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  variant?: "error" | "warning" | "success" | "info" | "default"
  confirmText?: string
  onConfirm?: () => void
  showCancel?: boolean
  cancelText?: string
  onCancel?: () => void
}

const ServerAlert = ({
  open,
  onOpenChange,
  title,
  description,
  variant = "error",
  confirmText = "Aceptar",
  onConfirm,
  showCancel = false,
  cancelText = "Cancelar",
  onCancel,
}: ServerAlertProps) => {
  // Determinar el icono basado en la variante
  const icon = React.useMemo(() => {
    switch (variant) {
      case "error":
        return <AlertCircle className="h-6 w-6 text-red-600 mb-2" />
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-600 mb-2" />
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
      case "info":
        return <Info className="h-6 w-6 text-blue-600 mb-2" />
      default:
        return null
    }
  }, [variant])

  // Determinar el color del botón de confirmación
  const confirmButtonClass = React.useMemo(() => {
    switch (variant) {
      case "error":
        return "bg-red-600 hover:bg-red-700 text-white"
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700 text-white"
      case "success":
        return "bg-green-600 hover:bg-green-700 text-white"
      case "info":
        return "bg-blue-600 hover:bg-blue-700 text-white"
      default:
        return "bg-primary hover:bg-primary/90 text-primary-foreground"
    }
  }, [variant])

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent variant={variant} onClose={() => onOpenChange(false)}>
        <AlertDialogHeader className="flex items-center">
          {icon}
          <AlertDialogTitle>
            {title || (variant === "error" ? "Error" : variant === "warning" ? "Advertencia" : variant === "success" ? "Éxito" : "Información")}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          {showCancel && (
            <AlertDialogCancel onClick={onCancel}>
              {cancelText}
            </AlertDialogCancel>
          )}
          <AlertDialogAction asChild>
            <Button 
              className={confirmButtonClass} 
              onClick={() => {
                onConfirm?.()
                onOpenChange(false)
              }}
            >
              {confirmText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  ServerAlert,
}
