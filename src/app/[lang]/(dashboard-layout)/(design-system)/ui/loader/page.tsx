// components/ui/loader.tsx
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils" // Shadcn utility for merging classes

interface LoaderProps {
  className?: string
  text?: string
  showText?: boolean
}

export const CustomLoader = ({
  text = "Processing...",
  showText = true,
}: LoaderProps) => {
  return (
    <>
      <div className="relative flex items-center justify-center">
        {/* Outer Glow / Ring */}
        <div className="absolute h-16 w-16 animate-pulse rounded-full bg-primary/10" />

        {/* The Main Spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
      </div>
      {showText && (
      <p className="mt-6 animate-pulse text-sm font-medium tracking-wide text-foreground/80">
        {text}
      </p>
    )}
    </>
  )
}
