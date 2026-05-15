"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
import { createPayoutAccount, updatePayoutAccount } from "@/components/dashboards/services/payoutAccountService"
import { PayoutType, PayoutBank, PayoutWallet } from "../constants"

interface PayoutAccountFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account?: any
  onSuccess: () => void
  dictionary: any
}

export function PayoutAccountForm({
  open,
  onOpenChange,
  account,
  onSuccess,
  dictionary,
}: PayoutAccountFormProps) {
  const [loading, setLoading] = useState(false)

  const formSchema = z.object({
    type: z.nativeEnum(PayoutType),
    bank: z.nativeEnum(PayoutBank).optional(),
    wallet: z.nativeEnum(PayoutWallet).optional(),
    // Properties
    iban: z.string().optional(),
    corporate_id: z.string().optional(),
    merchant_id: z.string().optional(),
    // Credentials
    company_code: z.string().optional(),
    cert: z.string().optional(),
    key: z.string().optional(),
    client_id: z.string().optional(),
    client_secret: z.string().optional(),
  }).superRefine((data, ctx) => {
    if (data.type === PayoutType.BANK) {
      if (!data.bank) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Bank is required", path: ["bank"] })
      } else {
        if (data.bank === PayoutBank.AL_RAJHI || data.bank === PayoutBank.SNB || data.bank === PayoutBank.ANB) {
          if (!data.iban) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "IBAN is required", path: ["iban"] })
        }
        if (data.bank === PayoutBank.SNB) {
          if (!data.corporate_id) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Corporate ID is required", path: ["corporate_id"] })
        }

        // Credentials validation
        if (data.bank === PayoutBank.AL_RAJHI) {
          if (!data.company_code) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Company Code is required", path: ["company_code"] })
          if (!data.cert) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Certificate is required", path: ["cert"] })
          if (!data.key) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Key is required", path: ["key"] })
        }
        if (data.bank === PayoutBank.SNB) {
          if (!data.client_id) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Client ID is required", path: ["client_id"] })
          if (!data.client_secret) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Client Secret is required", path: ["client_secret"] })
          if (!data.key) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Key is required", path: ["key"] })
        }
        if (data.bank === PayoutBank.ANB) {
          if (!data.client_id) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Client ID is required", path: ["client_id"] })
          if (!data.client_secret) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Client Secret is required", path: ["client_secret"] })
        }
      }
    }
    // else if (data.type === PayoutType.WALLET) {
    //   if (!data.wallet) {
    //     ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Wallet is required", path: ["wallet"] })
    //   } else {
    //     if (data.wallet === PayoutWallet.STC_PAY) {
    //       if (!data.merchant_id) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Merchant ID is required", path: ["merchant_id"] })
    //       if (!data.cert) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Certificate is required", path: ["cert"] })
    //       if (!data.key) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Key is required", path: ["key"] })
    //     }
    //   }
    // }
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: PayoutType.BANK,
      bank: undefined,
      wallet: undefined,
      iban: "",
      corporate_id: "",
      merchant_id: "",
      company_code: "",
      cert: "",
      key: "",
      client_id: "",
      client_secret: "",
    },
  })

  const watchType = form.watch("type")
  const watchBank = form.watch("bank")
  const watchWallet = form.watch("wallet")

  useEffect(() => {
    if (account) {
      form.reset({
        type: account.type || PayoutType.BANK,
        bank: account.bank,
        wallet: account.wallet,
        iban: account.iban || account.properties?.iban || "",
        corporate_id: account.corporate_id || account.properties?.corporate_id || "",
        merchant_id: account.merchant_id || account.properties?.merchant_id || "",
        company_code: account.company_code || account.credentials?.company_code || "",
        cert: account.cert || account.credentials?.cert || "",
        key: account.key || account.credentials?.key || "",
        client_id: account.client_id || account.credentials?.client_id || "",
        client_secret: account.client_secret || account.credentials?.client_secret || "",
      })
    } else {
      form.reset({
        type: PayoutType.BANK,
        bank: undefined,
        wallet: undefined,
        iban: "",
        corporate_id: "",
        merchant_id: "",
        company_code: "",
        cert: "",
        key: "",
        client_id: "",
        client_secret: "",
      })
    }
  }, [account, form, open])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    // Map flat values back to DTO structure
    const payload: any = {
      type: values.type,
      properties: {},
      credentials: {},
    }

    if (values.type === PayoutType.BANK) {
      payload.bank = values.bank
      if (values.bank === PayoutBank.AL_RAJHI || values.bank === PayoutBank.SNB || values.bank === PayoutBank.ANB) {
        payload.properties.iban = values.iban
      }
      if (values.bank === PayoutBank.SNB) {
        payload.properties.corporate_id = values.corporate_id
      }

      if (values.bank === PayoutBank.AL_RAJHI) {
        payload.credentials = { company_code: values.company_code, cert: values.cert, key: values.key }
      } else if (values.bank === PayoutBank.SNB) {
        payload.credentials = { client_id: values.client_id, client_secret: values.client_secret, key: values.key }
      } else if (values.bank === PayoutBank.ANB) {
        payload.credentials = { client_id: values.client_id, client_secret: values.client_secret }
      }
    } else {
      payload.wallet = values.wallet
      if (values.wallet === PayoutWallet.STC_PAY) {
        payload.properties.merchant_id = values.merchant_id
        payload.credentials = { cert: values.cert, key: values.key }
      }
    }

    let success = false
    if (account?._id) {
      success = await updatePayoutAccount(account._id, payload)
    } else {
      success = await createPayoutAccount(payload)
    }

    if (success) {
      onSuccess()
      onOpenChange(false)
    }
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {account?._id
              ? (dictionary?.payoutAccount?.editAccount || "Edit Payout Account")
              : (dictionary?.payoutAccount?.addAccount || "Add Payout Account")}
          </DialogTitle>
          <DialogDescription>
            {dictionary?.payoutAccount?.description || "Provide details for the payout account."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary?.payoutAccount?.type || "Payout Type"}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(PayoutType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {dictionary?.payoutAccount?.types?.[type] || type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchType === PayoutType.BANK && (
              <FormField
                control={form.control}
                name="bank"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary?.payoutAccount?.bank || "Bank"}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select bank" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(PayoutBank).map((bank) => (
                          <SelectItem key={bank} value={bank}>
                            {dictionary?.payoutAccount?.banks?.[bank] || bank}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* {watchType === PayoutType.WALLET && (
              <FormField
                control={form.control}
                name="wallet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary?.payoutAccount?.wallet || "Wallet"}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select wallet" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(PayoutWallet).map((wallet) => (
                          <SelectItem key={wallet} value={wallet}>
                            {dictionary?.payoutAccount?.wallets?.[wallet] || wallet}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )} */}

            {/* Dynamic Fields based on Bank/Wallet */}

            {/* IBAN for Banks */}
            {watchType === PayoutType.BANK && watchBank && (
              <FormField
                control={form.control}
                name="iban"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary?.payoutAccount?.iban || "IBAN"}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="SA..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Corporate ID for SNB */}
            {watchType === PayoutType.BANK && watchBank === PayoutBank.SNB && (
              <FormField
                control={form.control}
                name="corporate_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary?.payoutAccount?.corporateId || "Corporate ID"}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Merchant ID for STC Pay */}
            {/* {watchType === PayoutType.WALLET && watchWallet === PayoutWallet.STC_PAY && (
              <FormField
                control={form.control}
                name="merchant_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary?.payoutAccount?.merchantId || "Merchant ID"}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )} */}

            {/* Credentials Fields */}
            {watchType === PayoutType.BANK && watchBank === PayoutBank.AL_RAJHI && (
              <>
                <FormField
                  control={form.control}
                  name="company_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary?.payoutAccount?.companyCode || "Company Code"}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {(watchBank === PayoutBank.SNB || watchBank === PayoutBank.ANB) && (
              <>
                <FormField
                  control={form.control}
                  name="client_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary?.payoutAccount?.clientId || "Client ID"}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="client_secret"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary?.payoutAccount?.clientSecret || "Client Secret"}</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Cert and Key for Al Rajhi, SNB, STC Pay */}
            {(watchBank === PayoutBank.AL_RAJHI || watchBank === PayoutBank.SNB || watchWallet === PayoutWallet.STC_PAY) && (
              <>
                <FormField
                  control={form.control}
                  name="cert"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary?.payoutAccount?.cert || "Certificate"}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary?.payoutAccount?.key || "Key"}</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <DialogFooter>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (dictionary?.btnText?.save || "Saving...") : (dictionary?.btnText?.save || "Save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
