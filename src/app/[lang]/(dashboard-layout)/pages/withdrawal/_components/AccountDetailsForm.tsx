"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Landmark, User, Phone, MapPin, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { addBeneficiary } from "@/components/dashboards/services/apiService"

interface AccountDetailsFormProps {
  onSuccess: (data: any) => void
  dictionary: any
  initialData?: any
}

type AccountDetailsFormValues = {
  iban: string
  name: string
  mobile: string
  country: string
  city: string
}

// Regex for IBAN (Basic format: 2 letters + 2 digits + 4-30 alphanumeric)
const IBAN_REGEX = /^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/
// Regex for International Mobile (Supports +, spaces, dashes, and digits)
const MOBILE_REGEX = /^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$/

export function AccountDetailsForm({ onSuccess, dictionary, initialData }: AccountDetailsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<AccountDetailsFormValues>({
    defaultValues: {
      iban: "",
      name: "",
      mobile: "",
      country: "",
      city: "",
    },
  })

  // Pre-fill form if initialData exists
  useEffect(() => {
    if (initialData) {
      form.reset({
        iban: initialData.iban || "",
        name: initialData.name || "",
        mobile: initialData.mobile || "",
        country: initialData.country || "",
        city: initialData.city || "",
      })
    }
  }, [initialData, form])

  async function onSubmit(data: AccountDetailsFormValues) {
    setIsSubmitting(true)
    
    const result = await addBeneficiary(data)
    
    setIsSubmitting(false)

    if (result) {
      onSuccess(result)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-semibold">{dictionary.withdrawal?.accountDetails?.title || "Beneficiary Account Details"}</h3>
        <p className="text-sm text-muted-foreground">
          {dictionary.withdrawal?.accountDetails?.description || "All fields are compulsory. Please provide accurate information."}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            rules={{ 
              required: dictionary.withdrawal?.errors?.nameRequired || "Full name is required" 
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary.withdrawal?.accountDetails?.name || "Full Name"} *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder={dictionary.withdrawal?.accountDetails?.namePlaceholder || "Enter full name"} className="pl-10" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="iban"
            rules={{ 
              required: dictionary.withdrawal?.errors?.ibanRequired || "IBAN is required",
              pattern: {
                value: IBAN_REGEX,
                message: dictionary.withdrawal?.errors?.invalidIban || "Please enter a valid IBAN (e.g., SA...)"
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary.withdrawal?.accountDetails?.iban || "IBAN"} *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Landmark className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder={dictionary.withdrawal?.accountDetails?.ibanPlaceholder || "SA0000000000000000000000"} 
                      className="pl-10 uppercase" 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mobile"
            rules={{ 
              required: dictionary.withdrawal?.errors?.mobileRequired || "Mobile number is required",
              pattern: {
                value: MOBILE_REGEX,
                message: dictionary.withdrawal?.errors?.invalidMobile || "Please enter a valid international mobile number"
              }
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary.withdrawal?.accountDetails?.mobile || "Mobile Number"} *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder={dictionary.withdrawal?.accountDetails?.mobilePlaceholder || "+XXXXXXXXXXXX"} className="pl-10" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="country"
              rules={{ required: dictionary.withdrawal?.errors?.countryRequired || "Country is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.withdrawal?.accountDetails?.country || "Country"} *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder={dictionary.withdrawal?.accountDetails?.countryPlaceholder || "Enter country"} className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="city"
              rules={{ required: dictionary.withdrawal?.errors?.cityRequired || "City is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.withdrawal?.accountDetails?.city || "City"} *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder={dictionary.withdrawal?.accountDetails?.cityPlaceholder || "Enter city"} className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
            <p className="text-[11px] text-primary/80 leading-relaxed italic">
              {dictionary.withdrawal?.accountDetails?.note || "Note: Please ensure the above bank details are correct before processing the withdrawal. Incorrect details may lead to delayed or failed transactions."}
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? dictionary.navigation?.loading || "Saving..." : dictionary.withdrawal?.accountDetails?.save || "Save Details"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
