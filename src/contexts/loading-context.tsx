"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

import { loaderManager } from "@/lib/loading-manager"

const LoadingContext = createContext({
  setLoading: (state: boolean) => {},
})

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [isLoading, setIsLoading] = useState(false)

  // Sync the manager with the state only once or when setIsLoading changes
  useEffect(() => {
    loaderManager.setLoading = setIsLoading
  }, [])

  return (
    <LoadingContext.Provider value={{ setLoading: setIsLoading }}>
      {children}

      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/60 backdrop-blur-md transition-all cursor-not-allowed">
          <div className="relative flex items-center justify-center">
            {/* Outer Glow / Ring */}
            <div className="absolute h-16 w-16 animate-pulse rounded-full bg-primary/10" />

            {/* The Main Spinner */}
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
          </div>

          {/* Themed Text */}
          <p className="mt-6 animate-pulse text-sm font-medium tracking-wide text-foreground/80">
            Processing...
          </p>
        </div>
      )}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => useContext(LoadingContext)
