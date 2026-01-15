import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'
import { Form, useForm } from 'react-hook-form'

type ProfileInfoFormType = {
   name: string
   owner: string
   sport: string
   surfaceType: string
   size: string
   capacity: string
   price: string
   city: string
   district: string
   area: string
   address: string
   amenities: string[]
   courtImages: File[]
   description: string,
   bufferMinutes: number,
   slotDurationMinutes: number,
   selectedWeekDay: string,
   unitSize: string,
   titleImage: File | string | null,
   training: boolean
}

const SlotBooking = ({ step }: { step: string }) => {

   const form = useForm<ProfileInfoFormType>({
      defaultValues: {
         name: "",
      },
   })




   const {
      control,
      handleSubmit,
      watch,
      reset,
      formState: { errors },
   } = form

   function onFinalSubmit(data: ProfileInfoFormType) {
      // Put your real submission logic here (API call, etc)
      // onClose?.() // optionally close modal or reset state
   }

   const weekDaysOptions = [
      { label: "Monday", value: "MONDAY" },
      { label: "Tuesday", value: "TUESDAY" },
      { label: "Wednesday", value: "WEDNESDAY" },
      { label: "Thursday", value: "THURSDAY" },
      { label: "Friday", value: "FRIDAY" },
      { label: "Saturday", value: "SATURDAY" },
      { label: "Sunday", value: "SUNDAY" },
   ]

   return (
      <div>
         {step === "SLOT" && (
            <div className="mt-6 space-y-4">
               <p className="text-lg font-semibold">Book Your Slot</p>

               <Form {...form}>
                  <form onSubmit={handleSubmit(onFinalSubmit)}>
                     <div className="flex justify-between">
                        <div className="w-[12vw]">
                           <FormField
                              control={control}
                              name="selectedWeekDay"
                              rules={{ required: "Please select a day" }}
                              render={({ field }) => (
                                 <FormItem>
                                    <FormLabel>Select a weekday</FormLabel>
                                    <FormControl>
                                       <Select onValueChange={field.onChange} value={field.value}>
                                          <SelectTrigger>
                                             <SelectValue placeholder="Select weekday" />
                                          </SelectTrigger>
                                          <SelectContent>
                                             {weekDaysOptions.map((day: any) => (
                                                <SelectItem key={day.value} value={day.value}>
                                                   {day.label}
                                                </SelectItem>
                                             ))}
                                          </SelectContent>
                                       </Select>
                                    </FormControl>
                                    <FormMessage>{errors.selectedWeekDay?.message}</FormMessage>
                                 </FormItem>
                              )}
                           />
                        </div>
                     </div>
                  </form>
               </Form>



               <div className="flex gap-2 justify-end">
                  {/* <Button onClick={() => setStep("FORM")} variant="secondary">
                     Back
                  </Button> */}

                  <Button onClick={handleSubmit(onFinalSubmit)}>
                     Submit
                  </Button>
               </div>
            </div>
         )}
      </div>
   )
}

export default SlotBooking
