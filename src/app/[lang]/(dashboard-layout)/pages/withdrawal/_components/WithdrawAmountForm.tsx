"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Wallet, Info, FileText, ClipboardList } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { createWithdrawal } from "@/components/dashboards/services/apiService"

export enum WithdrawalPurpose {
  BILLS_OR_RENT = 'bills_or_rent',
  EXPENSES_SERVICES = 'expenses_services',
  PURCHASE_ASSETS = 'purchase_assets',
  SAVING_INVESTMENT = 'saving_investment',
  GOVERNMENT_DUES = 'government_dues',
  MONEY_EXCHANGE = 'money_exchange',
  CREDIT_CARD_LOAN = 'credit_card_loan',
  GIFT_OR_REWARD = 'gift_or_reward',
  PERSONAL = 'personal',
  INVESTMENT_TRANSACTION = 'investment_transaction',
  FAMILY_ASSISTANCE = 'family_assistance',
  DONATION = 'donation',
  PAYROLL_BENEFITS = 'payroll_benefits',
  ONLINE_PURCHASE = 'online_purchase',
  HAJJ_AND_UMRA = 'hajj_and_umra',
  DIVIDEND_PAYMENT = 'dividend_payment',
  GOVERNMENT_PAYMENT = 'government_payment',
  INVESTMENT_HOUSE = 'investment_house',
  PAYMENT_TO_MERCHANT = 'payment_to_merchant',
  OWN_ACCOUNT_TRANSFER = 'own_account_transfer',
}

interface WithdrawAmountFormProps {
  onSuccess: () => void
  onEditDetails?: () => void
  dictionary: any
  availableBalance: number
  currency: string
  userRole?: string
}

type WithdrawAmountFormValues = {
  purpose: string
  comment: string
}

export function WithdrawAmountForm({
  onSuccess,
  onEditDetails,
  dictionary,
  availableBalance,
  currency,
}: WithdrawAmountFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<WithdrawAmountFormValues>({
    defaultValues: {
      purpose: "",
      comment: "",
    },
  })

  async function onSubmit(data: WithdrawAmountFormValues) {
    if (availableBalance < 100) {
      return
    }

    if (!data.purpose) {
      form.setError("purpose", {
        message: dictionary.ErrorMsg?.selectStatus || "Please select a purpose",
      })
      return
    }

    setIsSubmitting(true)

    const success = await createWithdrawal({
      purpose: data.purpose,
      comment: data.comment
    })
    
    setIsSubmitting(false)

    if (success) {
      onSuccess()
    }
  }

  const isLowBalance = availableBalance < 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{dictionary.withdrawal?.request?.title || "Withdraw"}</h3>
          <p className="text-sm text-muted-foreground">
            {dictionary.withdrawal?.request?.description || "Please select the purpose and provide a comment for your withdrawal."}
          </p>
        </div>
        {onEditDetails && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onEditDetails}
            className="text-primary hover:text-primary/80 gap-2"
          >
            <Info className="h-4 w-4" />
            {dictionary.withdrawal?.accountDetails?.title || "Account Details"}
          </Button>
        )}
      </div>

      {isLowBalance && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-destructive mt-0.5" />
          <p className="text-sm text-destructive font-medium">
            {dictionary.withdrawal?.errors?.minBalanceRequired || "Minimum balance of 100 SAR is required to withdraw."}
          </p>
        </div>
      )}

      <Card className="bg-primary/5 border-none shadow-none">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {dictionary.withdrawal?.request?.availableBalance || "Available Balance"}
              </p>
              <p className="text-xl font-bold text-primary">
                {currency} {availableBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="purpose"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary.withdrawal?.request?.purpose || "Purpose"} *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-11">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder={dictionary.withdrawal?.request?.purposePlaceholder || "Select purpose"} />
                      </div>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(WithdrawalPurpose).map((purpose) => (
                      <SelectItem key={purpose} value={purpose}>
                        {dictionary.withdrawal?.purposes?.[purpose] || purpose.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dictionary.withdrawal?.request?.comment || "Comment"}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea 
                      placeholder={dictionary.withdrawal?.request?.commentPlaceholder || "Add a comment..."} 
                      className="pl-10 min-h-[100px] resize-none" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-2">
            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isSubmitting || isLowBalance}>
              {isSubmitting ? dictionary.navigation?.loading || "Processing..." : dictionary.withdrawal?.request?.submit || "Send Withdrawal Request"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
