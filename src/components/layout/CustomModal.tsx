import React from "react"

interface CustomModalProps {
   open: boolean
   title: string
   description: string
   onConfirm: () => void
   onCancel: () => void
   confirmText?: string
   cancelText?: string
   loading?: boolean
}

export function CustomModal({
   open,
   title,
   description,
   onConfirm,
   onCancel,
   confirmText = "Confirm",
   cancelText = "Cancel",
   loading = false,
}: CustomModalProps) {
   if (!open) return null

   return (
      <>
         {/* Blurred overlay */}
         <div
            onClick={onCancel}
            className="fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 "
         />

         {/* Modal */}
         <div className="fixed top-[50%] left-[50%] z-50 w-full max-w-[calc(100%-2rem)] grid translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg bg-background duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:max-w-lg max-h-[90vh] overflow-visible">
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <p className="mb-6">{description}</p>

            <div className="flex justify-end gap-3">
               <button
                  onClick={onCancel}
                  disabled={loading}
                  className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
                  type="button"
               >
                  {cancelText}
               </button>
               <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                  type="button"
               >
                  {loading ? "Processing..." : confirmText}
               </button>
            </div>
         </div>
      </>
   )
}
