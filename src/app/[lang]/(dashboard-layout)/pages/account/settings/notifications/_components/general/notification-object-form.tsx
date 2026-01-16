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
}

export function NotificationObjectForm({ onClose }: NotificationObjectFormProps) {


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
          rules={{ required: "Notification title is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter notification title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="message"
          rules={{ required: "Message is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter message" {...field} />
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
              <FormLabel>Recipient</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a recipient" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="OWNER">Owner</SelectItem>
                  <SelectItem value="USERS">Users</SelectItem>
                  <SelectItem value="EVERYONE">Everyone</SelectItem>
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
            Reset
          </Button>
          <Button type="submit">Send Notification</Button>
        </div>
      </form>
    </Form>
  )
}