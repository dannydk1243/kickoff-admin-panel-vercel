"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"

import { cn, getInitials } from "@/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import avatar from "@/../public/images/avatars/male-01.svg"
import { Input } from "@/components/ui/input"
import { InputPhone } from "@/components/ui/input-phone"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PhoneNumberInput } from "@/components/ui/PhoneNumberInput"
import { registerAdminOrOwner } from "@/components/dashboards/services/apiService"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type ProfileInfoState = {
  avatar?: File
  avatarPreview?: string
  name: string
  email: string
  phoneNumber: string
}

type ErrorsState = Partial<Record<keyof ProfileInfoState, string>>

type ProfileInfoFormProps = {
  onClose?: () => void
}

export function ProfileInfoForm({ onClose }: ProfileInfoFormProps) {
  const [formState, setFormState] = useState<ProfileInfoState>({
    avatar: undefined,
    avatarPreview: undefined,
    name: "",
    email: "",
    phoneNumber: "",
  })


  const [errors, setErrors] = useState<ErrorsState>({})

  const fieldLabels: Record<Exclude<keyof ProfileInfoState, "avatar" | "avatarPreview">, string> = {
    name: "Name",
    email: "Email",
    phoneNumber: "Phone Number",
  }

  function validateField(
    name: keyof ProfileInfoState,
    value: string | File | undefined
  ): string | undefined {
    if (name === "avatar" || name === "avatarPreview") return undefined

    const isEmpty =
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "")

    if (isEmpty) {
      return `${fieldLabels[name]} is required`
    }

    if (name === "email" && typeof value === "string" && !EMAIL_REGEX.test(value)) {
      return "Please enter a valid email address"
    }

    return undefined
  }

  function handleUploadPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const previewUrl = URL.createObjectURL(file)

    setFormState((prev) => ({
      ...prev,
      avatar: file,
      avatarPreview: previewUrl,
    }))
  }

  function handleRemovePhoto() {
    setFormState((prev) => ({
      ...prev,
      avatar: undefined,
      avatarPreview: undefined,
    }))
  }

  function handleChange(
    name: keyof ProfileInfoState,
    value: string | File | undefined
  ) {
    setFormState((prev) => ({ ...prev, [name]: value }))

    if (name === "avatar" || name === "avatarPreview") return

    if (typeof value === "string" && value.trim() === "") {
      setErrors((prev) => {
        const copy = { ...prev }
        delete copy[name]
        return copy
      })
      return
    }

    const error = validateField(name, value)
    setErrors((prev) => {
      const copy = { ...prev }
      if (error) copy[name] = error
      else delete copy[name]
      return copy
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const newErrors: ErrorsState = {}

      ; (Object.keys(formState) as Array<keyof ProfileInfoState>)
        .filter((key) => key !== "avatar" && key !== "avatarPreview")
        .forEach((field) => {
          const error = validateField(field, formState[field])
          if (error) newErrors[field] = error
        })

    setErrors(newErrors)


    if (Object.keys(newErrors).length > 0) return


    try {
      const success = await registerAdminOrOwner(formState as any)
      if (!success) {
        return
      }
      onClose?.()
    } catch (err: any) {
      console.error(err)
    }
  }

  function handleReset() {
    setFormState({
      avatar: undefined,
      avatarPreview: undefined,
      name: "",
      email: "",
      phoneNumber: "",
    })
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-y-4">
      {/* Upload Photo */}
      {/* <div className="flex items-center gap-x-4">
        <Avatar className="size-22">
          <AvatarImage src={formState.avatarPreview} />
          <AvatarFallback>{getInitials(formState.name || "U")}</AvatarFallback>
        </Avatar>

        <div className="grid gap-2">
          <label
            className={cn(
              buttonVariants({ variant: "default" }),
              "cursor-pointer w-fit"
            )}
          >
            Upload Photo
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUploadPhoto}
            />
          </label>

          <Button
            type="button"
            variant="destructive"
            onClick={handleRemovePhoto}
            disabled={!formState.avatar}
          >
            Remove Photo
          </Button>
        </div>
      </div> */}

      {/* Name */}
      <div>
        <label className="text-sm font-medium">Name</label>
        <Input
          placeholder="Enter your name"
          value={formState.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="text-sm font-medium">Email</label>
        <Input
          placeholder="name@example.com"
          value={formState.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      {/* Phone Number */}
      <PhoneNumberInput
        value={formState.phoneNumber}
        onChange={(value) => handleChange("phoneNumber", value)}
        error={errors.phoneNumber}
      />

      {/* Actions */}
      <div className="flex gap-x-2 mt-4 justify-end">
        <Button type="submit">Save</Button>
        <Button type="button" variant="secondary" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </form>
  )
}
