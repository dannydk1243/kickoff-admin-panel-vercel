"use client"

import React, { useCallback, useRef, useState } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

type TitleImageUploadProps = {
  value: File | string | null
  onChange: (file: File | null) => void
  error?: string
  disabled: boolean
}

export function TitleImageUpload({
  value,
  onChange,
  error,
  disabled,
}: TitleImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  function validateFile(file: File): string | null {
    if (!file.type.startsWith("image/")) {
      return "Only image files are allowed"
    }
    if (file.size > MAX_SIZE) {
      return "Image must be less than 5MB"
    }
    return null
  }

  const addFile = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return
      const file = fileList[0]
      const validationError = validateFile(file)
      if (validationError) {
        // You can handle error state here or pass via props
        return
      }
      onChange(file)
    },
    [onChange]
  )

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    addFile(e.dataTransfer.files)
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

  // Handler for remove image button
  function handleRemove(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation() // prevent triggering onClick on container
    onChange(null)
  }

  function isFile(value: File | string): value is File {
    return typeof value !== "string"
  }

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
        "relative flex flex-col items-center justify-center gap-2 rounded-lg cursor-pointer select-none",
        "h-[14vh] w-[20vw]",
        isDragging ? "border-gray-500" : "border-gray-500 bg-transparent",
        error && "border-red-500",
        "border border-[#e4e4e7] p-[0.3vw]"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          addFile(e.target.files)
          e.target.value = ""
        }}
      />

      {value ? (
        <div className="relative w-[19.4vw] h-[18vh] overflow-hidden rounded-[0.43vw]">
          {value instanceof File || value ? (
            <>
              <img
                src={isFile(value) ? URL.createObjectURL(value) : value}
                alt="Title image preview"
                className="h-full w-full object-cover"
                onLoad={(e) => {
                  if (isFile(value)) {
                    URL.revokeObjectURL((e.target as HTMLImageElement).src)
                  }
                }}
              />

              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg leading-none hover:bg-opacity-80 transition"
                aria-label="Remove image"
              >
                ×
              </button>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-black text-sm">
              No image selected
            </div>
          )}
        </div>
      ) : (
        <>
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
        </>
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}
