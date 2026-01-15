"use client"

import { useCallback, useRef, useState } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

const MAX_IMAGES = 10
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

type CourtImage = {
  url: string
  file?: File
  isTitle: boolean
  imageId?: string | number
}

type CourtImagesUploadProps = {
  value: CourtImage[]
  onChange: (images: CourtImage[]) => void
  error?: string
  courtImgChangeStatus: "nothing" | "uploaded" | "deleted"
  setCourtImgChangeStatus: (status: "nothing" | "uploaded" | "deleted") => void
  onDeleteIdsChange?: (deletedIds: (string | number)[]) => void // New optional prop
  disabled: boolean
}

export function CourtImagesUpload({
  value,
  onChange,
  error,
  courtImgChangeStatus,
  setCourtImgChangeStatus,
  onDeleteIdsChange,
  disabled,
}: CourtImagesUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  // State to track deleted image IDs
  const [deletedIds, setDeletedIds] = useState<(string | number)[]>([])

  function validateFile(file: File): string | null {
    if (!file.type.startsWith("image/")) {
      return "Only image files are allowed"
    }
    if (file.size > MAX_SIZE) {
      return "Image must be less than 5MB"
    }
    return null
  }

  // Debug log to see status changes

  const addFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return

      const validFiles = Array.from(files).filter((file) => !validateFile(file))

      const allowedFiles = validFiles.slice(0, MAX_IMAGES - value.length)
      if (allowedFiles.length === 0) return

      const newImages: CourtImage[] = allowedFiles.map((file, i) => ({
        file,
        url: URL.createObjectURL(file),
        isTitle: value.length === 0 && i === 0,
      }))

      onChange([...value, ...newImages])
      setCourtImgChangeStatus("uploaded") // set status to uploaded on add
    },
    [onChange, value, setCourtImgChangeStatus]
  )

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    addFiles(e.dataTransfer.files)
    // addFiles already sets status to 'uploaded'
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }

  function removeImage(index: number, imageId: string | number | undefined) {
    let updated = value.filter((_, i) => i !== index)

    if (!updated.some((img) => img.isTitle) && updated.length > 0) {
      updated[0].isTitle = true
    }

    onChange(updated)
    setCourtImgChangeStatus("deleted") // set status to deleted on remove

    if (imageId !== undefined && imageId !== null && imageId !== "") {
      setDeletedIds((prev) => {
        const newDeleted = [...prev, imageId]
        onDeleteIdsChange?.(newDeleted) // notify parent of deleted IDs
        return newDeleted
      })
    }
  }

  function setAsTitle(index: number) {
    onChange(
      value.map((img, i) => ({
        ...img,
        isTitle: i === index,
      }))
    )
    // Optional: You might want to NOT change status for title change
    // or add a different status if needed.
  }

  if (value.length === 0) {
    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled) {
            inputRef.current?.click()
          }
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg cursor-pointer select-none",
          "h-[12.5vh] w-full",
          isDragging
            ? "border-primary bg-muted/50"
            : "border-gray-500 bg-transparent",
          error && "border-red-500"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files)
            e.target.value = ""
          }}
        />
        <Image
          src="/images/icons/upload-icon.svg"
          alt=""
          height={24}
          width={24}
          className="dark:invert w-[2vw]"
        />
        <p className="text-sm text-muted-foreground select-none">
          Drop or import image here
        </p>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    )
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="grid grid-cols-5 gap-1">
        {value.map((img, index) => {
          const src = img.url
          const Id = img.imageId

          return (
            <div
              key={index}
              onClick={() => setAsTitle(index)}
              className={cn(
                "group relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all",
                value.length > 4 ? "h-[6vh]" : "h-[12.5vh]",
                "w-[3.8vw]",
                img.isTitle ? "border-gray-400" : "border-transparent"
              )}
            >
              <img
                src={src}
                alt={`Court Image ${index + 1}`}
                className="h-full w-full object-cover"
                onLoad={() => {
                  if (img.file instanceof File) {
                    URL.revokeObjectURL(src)
                  }
                }}
              />

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage(index, Id)
                }}
                className="absolute top-0 right-0 bg-black/60 text-white text-[0.5vw] px-[0.2vw] py-[0.1vh] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                ✕
              </button>
            </div>
          )
        })}

        {value.length < MAX_IMAGES && (
          <div
            onClick={() => {
              if (!disabled) {
                inputRef.current?.click()
              }
            }}
            className={cn(
              "relative w-[3.8vw] flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed cursor-pointer text-center",
              value.length > 4 ? "h-[6vh]" : "h-[12.5vh]",
              isDragging && "border-primary bg-muted/50",
              !isDragging && "border-gray-500",
              error && "border-red-500"
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                addFiles(e.target.files)
                e.target.value = ""
              }}
            />

            <div className="text-xl">📤</div>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

      {/* Optional: show status for debug */}
      {/* <p>Status: {courtImgChangeStatus}</p> */}
    </div>
  )
}
