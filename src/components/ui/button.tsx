"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#2EC4B6] to-[#4F7BFF] text-white shadow-md hover:shadow-lg hover:opacity-90 focus-visible:ring-[#2EC4B6]",
        secondary:
          "bg-white text-[#1F2937] border border-[#E5E7EB] shadow-sm hover:bg-[#F7FAFC] hover:border-[#2EC4B6] hover:text-[#2EC4B6] focus-visible:ring-[#2EC4B6]",
        outline:
          "border-2 border-[#2EC4B6] text-[#2EC4B6] bg-transparent hover:bg-[#e8faf9] focus-visible:ring-[#2EC4B6]",
        ghost:
          "text-[#6B7280] hover:bg-[#F7FAFC] hover:text-[#1F2937] focus-visible:ring-[#2EC4B6]",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500",
        warning:
          "bg-gradient-to-r from-[#FF8C42] to-[#FFD166] text-white shadow-md hover:shadow-lg hover:opacity-90 focus-visible:ring-[#FF8C42]",
        success:
          "bg-gradient-to-r from-[#10B981] to-[#2EC4B6] text-white shadow-md hover:shadow-lg hover:opacity-90 focus-visible:ring-[#10B981]",
        link:
          "text-[#2EC4B6] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-13 px-8 py-3 text-base",
        xl: "h-14 px-10 py-3.5 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Učitavanje...</span>
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
