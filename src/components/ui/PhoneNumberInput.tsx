"use client"

import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input"
import type { CountryCode } from "libphonenumber-js"
import "react-phone-number-input/style.css"
import { cn } from "@/lib/utils"

type PhoneNumberInputProps = {
   value: string | undefined
   onChange: (value: string | undefined) => void
   error?: string
   label?: string
   defaultCountry?: CountryCode
}

export function PhoneNumberInput({
   value,
   onChange,
   error,
   label = "Phone Number",
   defaultCountry = "PK" as CountryCode,
}: PhoneNumberInputProps) {
   return (
      <div>
         <label className="text-sm font-medium">{label}</label>
         <PhoneInput
            international
            defaultCountry={defaultCountry}
            value={value}
            onChange={onChange}
            countryCallingCodeEditable={false}
            className={cn(
               "phone-input flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
               error ? "border-red-500" : ""
            )}
         />

         {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
   )
}
