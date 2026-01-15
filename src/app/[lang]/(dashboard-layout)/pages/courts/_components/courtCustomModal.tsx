import React, { ReactNode } from "react"

interface CourtCustomModalProps {
   open: boolean
   onCancel: () => void
   children?: ReactNode
}

export function CourtCustomModal({
   open,
   onCancel,
   children,
}: CourtCustomModalProps) {
   if (!open) return null

   return (
      <>
         {/* Blurred overlay */}
         <div
            onClick={onCancel}
            className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
         />

         {/* Modal */}
         <div className="fixed top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] grid translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg bg-background duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:max-w-[65vw] max-h-[90vh] overflow-visible">
            {children}
         </div>
      </>
   )
}
