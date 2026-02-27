"use client"

import { usePathname } from "next/navigation"
import { useForm } from "react-hook-form"

// 1. Define a clear type for your specific form
type NotificationFormValues = {
  title: string
  message: string
  type: string
}

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { sendAnnouncements } from "@/components/dashboards/services/apiService"

type NotificationObjectFormProps = {
  onClose?: () => void
  callback?: () => void
  dictionary: any
}

export function NotificationObjectForm({ onClose, callback, dictionary }: NotificationObjectFormProps) {


  // 2. Initialize Form with correct default values
  const form = useForm<NotificationFormValues>({
    defaultValues: {
      title: "",
      message: "",
      type: "EVERYONE",
    },
  })

  // 3. Simplified Submit Handler
  async function onSubmit(data: NotificationFormValues) {
    try {
      // data contains title, description, and recipient
      const success = await sendAnnouncements(data)
      if (success) {
        form.reset()
        callback?.()
        onClose?.()
      }
    } catch (err: any) {
      console.error("Submission error:", err)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-y-4">

        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          rules={{ required: dictionary.ErrorMsg.notificationTitleRequired }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.courtLabel.notificationTitle}</FormLabel>
              <FormControl>
                <Input placeholder={dictionary.placeholder.enterNotificationTitle} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="message"
          rules={{ required: dictionary.ErrorMsg.messageRequired }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.courtLabel.message}</FormLabel>
              <FormControl>
                <Textarea placeholder={dictionary.placeholder.enterMessage} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Recipient */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.courtLabel.recipient}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={dictionary.placeholder.selectRecipient} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ADMIN">{dictionary.courtLabel.admin}</SelectItem>
                  <SelectItem value="OWNER">{dictionary.courtLabel.owner}</SelectItem>
                  <SelectItem value="USERS">{dictionary.courtLabel.users}</SelectItem>
                  <SelectItem value="EVERYONE">{dictionary.courtLabel.everyone}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex gap-x-2 mt-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
          >
            {dictionary.btnText.reset}
          </Button>
          <Button type="submit">{dictionary.btnText.sendNotification}</Button>
        </div>
      </form>
    </Form>
  )
}