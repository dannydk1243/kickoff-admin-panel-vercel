"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import Cookies from "js-cookie"
import { DateRange } from "react-day-picker"
import { Controller, useForm } from "react-hook-form"

import { DictionaryType } from "@/lib/get-dictionary"
import { useTranslation } from "@/lib/translationContext"
import { getStatusHandler } from "@/lib/utils"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { DatePicker as DatePickerComponent } from "@/components/ui/date-picker"
import { DateRangePicker as DateRangePickerComponent } from "@/components/ui/date-range-picker"
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
import { Switch } from "@/components/ui/switch"
import { TimePicker as TimePickerComponent } from "@/components/ui/time-picker"
import {
  courtCreation,
  createCourtAvailability,
  createCourtUnvalaibility,
  getCourtAvailability,
  getCourtById,
  getCourtUnavailability,
  getOnlyOwners,
  updateCourtStatus,
} from "@/components/dashboards/services/apiService"
import { CourtImagesUpload } from "./courtImagesUpload"
import { TitleImageUpload } from "./titleImageUpload"

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
  mapUrl: string
  amenities: string[]
  courtImages: File[]
  description: string
  bufferMinutes: number
  slotDurationMinutes: number
  selectedWeekDay: string
  unitSize: string
  titleImage: File | string | null
  status: string
  training: boolean
  startHours: string
  startMinute: string
  endtHours: string
  endtMinute: string
  offDay: boolean
  offDayType: string
  offDayStartHours: string
  offDayStartMinute: string
  offDayEndtHours: string
  offDayEndtMinute: string
  dateType: string
}

type CourtApiResponse = {
  court: {
    _id: string
    name: string
    description: string
    sport: string
    surface: string
    size: string
    capacity: number
    price: number
    amenities: string[]
    slotDurationMinutes: number
    bufferMinutes: number
    offersTraining: boolean
    owner: {
      _id: string
      name: string
    }
    location: {
      city: string
      district: string
      area: string
      address: string
    }
    avatar: string
  }
  attachments: {
    _id: string
    url: string
  }[]
}

type ProfileInfoFormProps = {
  onClose?: () => void
  selectedOwner?: string
  setSelectedOwner?: (owner: string) => void
  allOwnersList?: string[]
  courtId: string
  view: boolean
  // setAllOwnersList?: (owner: string) => void
}

type CourtImage = {
  url: string // URL of the image, either local or remote
  file?: File // optional File if newly added and not yet uploaded
  isTitle: boolean
}

type LabelType = {
  soon: string
  new: string
  createCourt: string // add here
}

const getCurrentTime24 = (minutesToAdd: number) => {
  const now = new Date()
  now.setMinutes(now.getMinutes() + minutesToAdd)
  const hours = String(now.getHours()).padStart(2, "0")
  const mins = String(now.getMinutes()).padStart(2, "0")
  return `${hours}:${mins}`
}

// Initialize state with today's date as `from` and tomorrow as `to`
const today = new Date()
// const tomorrow = new Date();
// tomorrow.setDate(today.getDate() + 1);

export function CourtForm({
  onClose,
  selectedOwner,
  setSelectedOwner,
  courtId,
  view,
}: ProfileInfoFormProps) {
  const [userRole, setUserRole] = useState<string | undefined>()
  const [courtStatus, setCourtStatus] = useState<string>("APPROVED")
  const [statusDropdown, setStatusDropDown] = useState<string>("")
  const [statusRej, setStatusRej] = useState<string>("")
  const [error, setError] = useState<string>("")

  const [step, setStep] = useState<"FORM" | "SLOT">("FORM")
  const [courtImages, setCourtImages] = useState<CourtImage[]>([])
  const [allOwnersList, setAllOwnersList] = useState<any>([])
  const [editCourtForm, setEditCourtForm] = useState<boolean>(false)
  const [courtImgChangeStatus, setCourtImgChangeStatus] = useState<
    "nothing" | "uploaded" | "deleted"
  >("nothing")
  const [deletedCimagesIds, setDeletedCimagesIds] = useState<string[]>([])
  const [hasAmenitiesChanged, setHasAmenitiesChanged] = useState(false)
  const [courtResponceId, setCourtResponceId] = useState("")
  const [openingTime, setOpeningTime] = useState<string | undefined>()
  const [closingTime, setClosingTime] = useState<string | undefined>()

  const [offDayStartTime, setOffDayStartTime] = useState<string | undefined>()
  const [offDayEndTime, setOffDayEndTime] = useState<string | undefined>()

  const [range, setRange] = useState<DateRange>({ from: today, to: today })
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [dateTypeValue, setDateTypeValue] = useState("dateRange")
  const [isOffDay, setIsOffDay] = useState(false)
  const [offDayType, setOffDayType] = useState("Partial")
  const dictionary: any = useTranslation()
  const initialValuesRef = useRef<ProfileInfoFormType | null>(null)

  let { createCourt, courtName, editCourt } = dictionary.label

  const form = useForm<ProfileInfoFormType>({
    defaultValues: {
      name: "",
      owner: selectedOwner ?? "",
      sport: "", // added sport default value
      surfaceType: "",
      size: "",
      capacity: "",
      price: "",
      city: "",
      district: "",
      area: "",
      address: "",
      amenities: [],
      courtImages: [],
      description: "",
      bufferMinutes: 10,
      slotDurationMinutes: 60,
      selectedWeekDay: "",
      unitSize: "m²",
      titleImage: null,
      status: "",
      training: true,
      startHours: "",
      startMinute: "",
      endtHours: "",
      endtMinute: "",
      offDay: false,
      offDayType: "Partial",
      offDayStartHours: "",
      offDayStartMinute: "",
      offDayEndtHours: "",
      offDayEndtMinute: "",
      dateType: "dateRange",
    },
  })

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = form

  const amenitiesOptions = [
    { label: "Parking", value: "PARKING" },
    { label: "Washroom", value: "WASHROOM" },
    { label: "Shower", value: "SHOWER" },
    { label: "AC / Heating", value: "AC_HEATING" },
    { label: "Changing Room", value: "CHANGING_ROOM" },
    { label: "First Aid", value: "FIRST_AID" },
    { label: "Water", value: "WATER" },
  ]

  const weekDaysOptions = [
    { label: "Daily", value: "daily" },
    { label: "Every Weekday (Monday to Friday)", value: "mondayToFriday" },
    { label: "Monday to Saturday", value: "mondayToSaturday" },
  ]

  const isSameDate = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  useEffect(() => {
    // Read the cookie only after the component mounts to avoid Hydration errors
    const value = Cookies.get("adminProfile") ?? ""
    const adminData = JSON.parse(value)

    // 3. Update your state
    setUserRole(adminData.role)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value

    // Update state
    setStatusRej(val)

    // Simple validation logic
    if (val.length > 250) {
      setError("Reason cannot exceed 250 characters")
    } else if (val.length === 0) {
      setError("Reason is required")
    } else {
      setError("")
    }
  }

  async function handleClick() {
    // 1. Validation Check: Ensure a status is actually selected
    if (!statusDropdown) {
      triggerError("Please select a status")
      return
    }

    // 2. Validation Check: Ensure reason is provided for rejection
    if (statusDropdown === "REJECTED" && statusRej.trim() === "") {
      setError("Rejection reason is required") // Assuming you have an setError state
      return
    }

    try {
      // 3. Construct the body dynamically
      const body = {
        courtId: courtId,
        status: statusDropdown,
        // Only include feedback if it's rejected
        ...(statusDropdown === "REJECTED" && { feedback: statusRej }),
      }

      const cres = await updateCourtStatus(body)

      // 4. Handle Success
      if (cres) {
        // console.log("Status updated successfully")
        onClose?.() // Close modal for BOTH Approved and Rejected success
      }
    } catch (err) {
      // 5. Handle API Errors
      console.error("Failed to update status:", err)
      triggerError("Something went wrong. Please try again.")
    }
  }

  function handleDateChange(newDate?: Date) {
    setDate(newDate)
  }

  function handleRangeChange(newRange?: DateRange) {
    // newRange can be undefined, so handle that if needed
    if (newRange) {
      setRange(newRange)
    } else {
      // Reset or handle undefined value if your component allows clearing the range
      setRange({ from: undefined, to: undefined })
    }
  }

  useEffect(() => {
    if (!courtId) return
    if (courtId) {
      setEditCourtForm(true)
    }
    const fetchCourt = async () => {
      const [res] = await Promise.all([
        getCourtById(courtId),
        //   getCourtAvailability(courtId),
        //   getCourtUnavailability(courtId),
      ])
      if (!res?.court) return
      if (res) {
        //   console.log("debug: ", res, availabilityRes, unavailabilityRes)
        const { court, attachments } = res

        let sizeValue = "" // 👈 declare outside
        let sizeUnit = "" // 👈 declare outside

        const size = court.size // "456YARD" or "200m²"
        const match = size.match(/^(\d+(?:\.\d+)?)(m²|YARD)$/)

        if (match) {
          sizeValue = match[1] // "456"
          sizeUnit = match[2] // "YARD" | "m²"
        }
        let firstSlot = { openTime: "00:00", closeTime: "00:00" }
        if (res.dailySlots.length > 0) {
          firstSlot = res.dailySlots[0]
        }
        let [startH, startM] = firstSlot.openTime.split(":")
        let [endH, endM] = firstSlot.closeTime.split(":")
        setOpeningTime(firstSlot.openTime)
        setClosingTime(firstSlot.closeTime)

        let selection = ""
        const dayCount = res.dailySlots.length

        // Determine the dropdown value based on the number of days returned
        if (dayCount === 7) selection = "daily"
        else if (dayCount === 6) selection = "mondayToSaturday"
        else if (dayCount === 5) selection = "mondayToFriday"
        setCourtStatus(res.court.status)
        const initialValues: ProfileInfoFormType = {
          name: court.name,
          owner: court.owner._id,
          sport: court.sport,
          surfaceType: court.surface,
          size: sizeValue,
          unitSize: sizeUnit,
          capacity: String(court.capacity),
          price: String(court.price),
          city: court.location.city,
          district: court.location.district,
          area: court.location.area,
          address: court.location.address,
          mapUrl: court.location.mapUrl,
          amenities: court.amenities,
          description: court.description,
          bufferMinutes: court.bufferMinutes,
          slotDurationMinutes: court.slotDurationMinutes,
          training: court.offersTraining,
          titleImage: court.avatar,
          status: court.status,
          courtImages: [],
          selectedWeekDay: selection,
          startHours: startH,
          startMinute: startM,
          endtHours: endH,
          endtMinute: endM,
          offDay: false,
          offDayType: "Partial",
          offDayStartHours: "",
          offDayStartMinute: "",
          offDayEndtHours: "",
          offDayEndtMinute: "",
          dateType: "dateRange",
        }
        reset(initialValues)
        initialValuesRef.current = initialValues

        setSelectedOwner?.(court.owner._id)

        const existingImages: CourtImage[] = attachments.map(
          (img: { url: any; _id: any }, index: number) => ({
            url: img.url,
            isTitle: index === 0,
            imageId: img._id,
          })
        )

        setCourtImages(existingImages)
      }
    }

    fetchCourt()
  }, [courtId, reset, setSelectedOwner])

  // Then, create a function to detect changed fields:

  function getChangedFields() {
    if (!initialValuesRef.current) return []

    type FormKeys = keyof ProfileInfoFormType
    const changedFields: FormKeys[] = []

    // watchedValues comes from RHF watch()
    const watchedValues = watch()

    ;(Object.keys(watchedValues) as FormKeys[]).forEach((key) => {
      const currentValue = watchedValues[key]
      const initialValue = initialValuesRef.current![key]

      const changed = Array.isArray(currentValue)
        ? JSON.stringify(currentValue) !== JSON.stringify(initialValue)
        : currentValue !== initialValue

      if (changed) changedFields.push(key)
    })

    return changedFields
  }

  // Example usage: call this inside an event or effect

  useEffect(() => {
    const changed = getChangedFields()
  }, [watch()]) // this runs whenever form values change

  useEffect(() => {
    if (!courtId && selectedOwner) {
      reset((prev) => ({
        ...prev,
        owner: selectedOwner,
      }))
    }
  }, [selectedOwner, reset, courtId])

  useEffect(() => {
    if (courtId) return
    const fetchData = async () => {
      // setLoading(true);
      const res = await getOnlyOwners()

      if (res?.admins) {
        setAllOwnersList(res.admins)
      } else {
        setAllOwnersList([])
      }
    }

    fetchData()
  }, [])

  // Sync owner field changes to external setSelectedOwner
  const ownerValue = watch("owner")
  useEffect(() => {
    if (ownerValue !== selectedOwner) {
      setSelectedOwner?.(ownerValue)
    }
  }, [ownerValue, selectedOwner, setSelectedOwner])

  async function onFormSubmit(
    data: ProfileInfoFormType,
    changedFields: (keyof ProfileInfoFormType)[]
  ) {
    try {
      // Pass changedFields if your API accepts it
      const success = await courtCreation(
        data,
        courtImages,
        courtId,
        changedFields,
        courtImgChangeStatus,
        setCourtImgChangeStatus,
        deletedCimagesIds,
        hasAmenitiesChanged,
        setStep
      )

      if (!success.court) {
        setCourtResponceId(success?._id)
      } else {
        setCourtResponceId(success?.court?._id)
      }

      if (!success) {
        // handle failure
      }
    } catch (err: any) {
      getStatusHandler(err?.status, err?.message)
    }
  }
  // Weekday filtering
  const allWeekDays = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ]

  function getFilteredWeekDays(selectedWeekDay: string) {
    switch (selectedWeekDay) {
      case "daily":
        return allWeekDays
      case "mondayToFriday":
        return allWeekDays.filter(
          (day) => day !== "SATURDAY" && day !== "SUNDAY"
        )
      case "mondayToSaturday":
        return allWeekDays.filter((day) => day !== "SUNDAY")
      default:
        return []
    }
  }

  const triggerError = (description: string) => {
    toast({ variant: "destructive", title: "Validation Error", description })
  }

  const parseTimeToMinutes = (time?: string): number => {
    if (!time || typeof time !== "string" || !time.includes(":")) return -1

    // Use .trim() to ensure no hidden spaces cause parsing issues
    const [hoursStr, minutesStr] = time.split(":")
    const hours = parseInt(hoursStr, 10)
    const minutes = parseInt(minutesStr, 10)

    if (isNaN(hours) || isNaN(minutes)) return -1
    return hours * 60 + minutes
  }

  const combineDateAndTimeToISOString = (date: Date, time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const newDate = new Date(date)
    newDate.setHours(hours, minutes, 0, 0)
    return newDate.toISOString()
  }

  async function onFinalSubmit(data: ProfileInfoFormType) {
    // 1. Basic Presence Validation
    if (!data.selectedWeekDay) return triggerError("Please select a weekday")
    if (!openingTime || !closingTime)
      return triggerError("Operating hours are required")

    const openMins = parseTimeToMinutes(openingTime)
    const closeMins = parseTimeToMinutes(closingTime)

    // 2. Off Day Logic & Restrictions
    let offDayPayload = null

    if (isOffDay) {
      if (!range?.from || !range?.to)
        return triggerError("Select off-day dates")

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const selectedStartDate = new Date(range.from)
      selectedStartDate.setHours(0, 0, 0, 0)

      // 1. DATE RESTRICTION: Full Day cannot be today
      if (
        offDayType === "Full" &&
        selectedStartDate.getTime() === today.getTime()
      ) {
        return triggerError(
          "Full off-days must be scheduled at least one day in advance."
        )
      }

      // Initializing defaults
      let startT = "00:00"
      let endT = "23:59"

      if (offDayType === "Partial") {
        // 2. Presence Check
        if (!offDayStartTime || !offDayEndTime) {
          return triggerError("Partial times are required")
        }

        const offStartMins = parseTimeToMinutes(offDayStartTime)
        const offEndMins = parseTimeToMinutes(offDayEndTime)

        // BUG RESOLUTION: Check if parsing failed (-1) before comparing
        if (offStartMins === -1 || offEndMins === -1) {
          return triggerError(
            "Invalid time format. Please re-select the times."
          )
        }

        // 3. Internal Logic: Start must be before End
        if (offStartMins >= offEndMins) {
          return triggerError("Start time must be before end time.")
        }

        // 4. Business Hours Containment
        // Ensure openMins and closeMins are defined in your outer scope
        if (offStartMins < openMins || offEndMins > closeMins) {
          return triggerError(
            `Off-day must fall within ${openingTime} and ${closingTime}`
          )
        }

        // 5. Past Time Protection: Only if the selected date is Today
        if (selectedStartDate.getTime() === today.getTime()) {
          const now = new Date()
          const currentTimeMins = now.getHours() * 60 + now.getMinutes()

          if (offStartMins < currentTimeMins) {
            return triggerError("Off-day start time cannot be in the past.")
          }
        }

        // 6. Assignment
        startT = offDayStartTime
        endT = offDayEndTime
      }

      offDayPayload = {
        startDatetime: combineDateAndTimeToISOString(range.from, startT),
        endDatetime: combineDateAndTimeToISOString(range.to, endT),
        scope: offDayType.toUpperCase(),
      }
    }

    // 3. Payload Construction
    const finalPayload = {
      ...data,
      dailySlots: getFilteredWeekDays(data.selectedWeekDay)?.map((day) => ({
        day,
        openTime: openingTime,
        closeTime: closingTime,
      })),
      offDayPayloadData: offDayPayload,
    }
    try {
      if (isOffDay) {
        const [availabilityRes, offDayRes] = await Promise.all([
          createCourtAvailability(courtResponceId, finalPayload?.dailySlots),
          createCourtUnvalaibility(
            courtResponceId,
            finalPayload?.offDayPayloadData
          ),
        ])
        // Handle results
        if (availabilityRes && offDayRes) {
          toast({
            title: "Success",
            description: "Availability and Off-days updated successfully.",
          })
        }
      } else {
        const cres = await createCourtAvailability(
          courtResponceId,
          finalPayload?.dailySlots
        )
      }
      onClose?.()
    } catch (error) {
      console.error("Parallel API Error:", error)
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "One or more updates failed to save.",
      })
    }
  }

  function handleReset() {
    reset({
      name: "",
      owner: "",
      sport: "",
      unitSize: "m²", // ✅ keep default
      training: true,
    })
    setCourtImages?.([])
    setSelectedOwner?.("")
  }

  return (
    <div>
      {step === "FORM" && (
        <Form {...form}>
          <form
            onSubmit={handleSubmit((data) => {
              const changedFields = getChangedFields()
              onFormSubmit(data, changedFields)
            })}
          >
            <div className=" text-[0.94vw] font-bold">
              {/* If view is true, you might want a "View Court" title instead */}
              {view ? "View Court" : !courtId ? createCourt : editCourt}
            </div>

            <div className="grid grid-cols-4 gap-x-4 gap-y-4 mt-[1.5vh]">
              {/* Name */}
              <div className="h-[8.5vh]">
                <FormField
                  control={control}
                  name="name"
                  rules={{ required: "Court Name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{courtName}*</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter court name"
                          disabled={view}
                        />
                      </FormControl>
                      <FormMessage>{errors.name?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {!courtId && (
                <div className="h-[8.5vh]">
                  {/* Owner */}
                  <FormField
                    control={control}
                    name="owner"
                    rules={{ required: "Court Owner is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Court Owner*</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={view}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select owner" />
                            </SelectTrigger>
                            <SelectContent>
                              {allOwnersList?.map((val: any, index: any) => (
                                <SelectItem value={val?._id} key={index}>
                                  {val?.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage>{errors.owner?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Sport Type */}
              <div className="h-[8.5vh]">
                <FormField
                  control={control}
                  name="sport"
                  rules={{ required: "Sport Type is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sport Type*</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={view}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select sport" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FOOTBALL">Football</SelectItem>
                            <SelectItem value="PADEL">Padel</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage>{errors.sport?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* Surface Type */}
              <div className="h-[8.5vh]">
                <FormField
                  control={control}
                  name="surfaceType"
                  rules={{ required: "Surface Type is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Surface Type*</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={view}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select surface type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NATURAL_GRASS">
                              Natural Grass
                            </SelectItem>
                            <SelectItem value="ARTIFICIAL_TURF">
                              Artificial Turf
                            </SelectItem>
                            <SelectItem value="CARPET">Carpet</SelectItem>
                            <SelectItem value="CONCRETE">Concrete</SelectItem>
                            <SelectItem value="WOOD">Wood</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage>{errors.surfaceType?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* Court Size & Unit */}
              <div className="flex ">
                <div className="h-[8.5vh] ">
                  <FormField
                    control={control}
                    name="size"
                    rules={{ required: "Court Size is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Court Size*</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={view}
                            placeholder="Size"
                            className="w-[11vw] rounded-br-none rounded-tr-none "
                            onInput={(e) => {
                              if (view) return
                              const input = e.currentTarget
                              let val = input.value.replace(/[^0-9.]/g, "")
                              input.value = val
                              field.onChange(val)
                            }}
                          />
                        </FormControl>
                        <FormMessage>{errors.size?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="h-[8.5vh]">
                  <FormField
                    control={control}
                    name="unitSize"
                    render={({ field }) => (
                      <FormItem className="w-[4vw] mt-[2.2vh]">
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={view}
                          >
                            <SelectTrigger className="rounded-bl-none rounded-tl-none border-l-0 ">
                              <SelectValue placeholder="unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="m²">m²</SelectItem>
                              <SelectItem value="YARD">Yard</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Capacity, Slot Duration, Buffer, Price (Apply disabled={view} to all) */}
              {/* ... (Apply similar logic to Capacity, SlotDuration, Buffer, Price inputs) ... */}

              <div className="h-[8.5vh]">
                <FormField
                  control={control}
                  name="capacity"
                   rules={{ required: "Capacity is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity*</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={view} placeholder="Capacity" />
                      </FormControl>
                      <FormMessage>{errors.size?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* Example for Price */}
              <div className="h-[8.5vh]">
                <FormField
                  control={control}
                  name="price"
                  rules={{ required: "Price is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price*</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={view} placeholder="Price" />
                      </FormControl>
                      <FormMessage>{errors.price?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* City, District, Area, Address */}
              {/* ... (Apply disabled={view} to these Inputs) ... */}
              <div className="h-[8.5vh]">
                <FormField
                  control={control}
                  name="mapUrl"
                  rules={{ required: "Map URL is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Map URL*</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={view} placeholder="Map Url" />
                      </FormControl>
                      <FormMessage>{errors.mapUrl?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <div className="h-[8.5vh]">
                <FormField
                  control={control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="City" disabled={view} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="h-[8.5vh]">
                <FormField
                  control={control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Area" disabled={view} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="h-[8.5vh]">
                <FormField
                  control={control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Address" disabled={view} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Offers Training Switch */}
              <div className="flex items-center gap-x-2 mb-[1vh]">
                <Controller
                  name="training"
                  control={form.control}
                  render={({ field }) => (
                    <Switch
                      id="switch"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={view}
                    />
                  )}
                />
                <FormLabel>Offers Training</FormLabel>
              </div>
            </div>

            <div className=" text-[0.94vw] font-bold">Amenities</div>

            {/* Amenities Checkboxes */}
            <div className="grid grid-cols-7 gap-3 mt-[1vh]">
              {amenitiesOptions.map((option) => (
                <FormField
                  key={option.value}
                  control={control}
                  name="amenities"
                  render={({ field }) => {
                    const checked = field.value?.includes(option.value)
                    const onChange = () => {
                      if (view) return // Prevent change logic if viewing
                      let newValue = checked
                        ? field.value.filter(
                            (item: string) => item !== option.value
                          )
                        : [...field.value, option.value]
                      field.onChange(newValue)
                      setHasAmenitiesChanged(true)
                    }
                    return (
                      <FormItem className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          disabled={view}
                          id={option.value}
                          checked={checked}
                          onChange={onChange}
                          className="w-4 h-4 rounded border-gray-300 disabled:opacity-50"
                        />
                        <label
                          htmlFor={option.value}
                          className="text-sm select-none"
                        >
                          {option.label}
                        </label>
                      </FormItem>
                    )
                  }}
                />
              ))}
            </div>

            <div className="flex mt-[3vh] justify-between ">
              {/* Image Uploads - Ensure these components handle a 'disabled' prop */}
              <div className="w-[20vw]">
                <FormField
                  control={control}
                  name="titleImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title Image*</FormLabel>
                      <FormControl>
                        <TitleImageUpload
                          disabled={view}
                          value={field?.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-[20.8vw]">
                <FormField
                  control={control}
                  name="courtImages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Court Pictures</FormLabel>
                      <div className="border border-[#e4e4e7] rounded-md p-[0.3vw]">
                        <FormControl>
                          <CourtImagesUpload
                            disabled={view}
                            value={courtImages}
                            onChange={setCourtImages}
                            courtImgChangeStatus={courtImgChangeStatus}
                            setCourtImgChangeStatus={setCourtImgChangeStatus}
                            onDeleteIdsChange={(deletedIds) => {
                              if (view) return
                              setDeletedCimagesIds(deletedIds.map(String))
                            }}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Description Textarea */}
              <div className="w-[20vw]">
                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description*</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          disabled={view}
                          rows={6}
                          className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {view && (
              <div className="w-full flex flex-wrap items-end gap-4 border-b pb-6 pt-6">
                <FormField
                  control={control}
                  name="selectedWeekDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Days</FormLabel>
                      <Select
                        disabled={view}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select weekday nothing added" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {weekDaysOptions.map((day) => (
                            <SelectItem key={day.value} value={day.value}>
                              {day.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="startHours"
                  render={({ field }) => (
                    <FormItem className="w-[12vw]">
                      <FormLabel>Opening Time</FormLabel>
                      <TimePickerComponent
                        disabled={view}
                        value={openingTime}
                        onValueChange={setOpeningTime}
                      />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="endtHours"
                  render={({ field }) => (
                    <FormItem className="w-[12vw]">
                      <FormLabel>Closing Time</FormLabel>
                      <TimePickerComponent
                        disabled={view}
                        value={closingTime}
                        onValueChange={setClosingTime}
                      />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* FOOTER BUTTONS: Hide completely if view is true */}
            {userRole != "OWNER" && view && courtStatus != "APPROVED" && (
              <div className=" flex gap-x-20  mt-4 justify-center">
                <FormField
                  name="selectedStatus"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={(val) => {
                          // setCourtStatus(val)
                          setStatusDropDown(val)
                        }}
                        value={statusDropdown}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="REJECTED">Rejected</SelectItem>
                          <SelectItem value="APPROVED">Approved</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {statusDropdown == "REJECTED" && (
                  <div className="space-y-2">
                    {/* <label className="text-sm font-medium">
                      Rejection Reason*
                    </label> */}

                    <Input
                      value={statusRej}
                      onChange={handleInputChange} // Fix: Uses the event to get the string
                      placeholder="State reason of Rejection (max. 250)"
                      className={error ? "border-red-500" : ""}
                    />

                    {/* Manual Error Message */}
                    {error && (
                      <p className="text-sm text-red-500 font-medium">
                        {error}
                      </p>
                    )}

                    {/* Character Counter (Optional but helpful) */}
                    {/* <p className="text-xs text-muted-foreground text-right">
                      {statusRej.length}/250
                    </p> */}
                  </div>
                )}
                <Button type="button" onClick={handleClick}>
                  Update
                </Button>
              </div>
            )}
            {!view && (
              <div className="col-span-2 flex gap-x-2 justify-end mt-4">
                {courtId ? (
                  (hasAmenitiesChanged ||
                    courtImgChangeStatus !== "nothing" ||
                    getChangedFields().length > 0) && (
                    <>
                      <Button type="submit">Save</Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleReset}
                      >
                        Reset
                      </Button>
                    </>
                  )
                ) : (
                  <Button type="submit">Create Court</Button>
                )}
              </div>
            )}
          </form>
        </Form>
      )}

      {/* <SlotBooking step={step} /> */}
      {step === "SLOT" && (
        <div className="space-y-6">
          {" "}
          {/* Increased spacing */}
          <p className="text-lg font-semibold">Book Your Slot</p>
          <Form {...form}>
            <form onSubmit={handleSubmit(onFinalSubmit)} className="space-y-8">
              {/* Row 1: Regular Schedule */}
              <div className="flex flex-wrap items-end gap-4 border-b pb-6">
                <div className="w-[18vw]">
                  <FormField
                    control={control}
                    name="selectedWeekDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Days</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select weekday nothing added" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {weekDaysOptions.map((day) => (
                              <SelectItem key={day.value} value={day.value}>
                                {day.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={control}
                  name="startHours"
                  render={({ field }) => (
                    <FormItem className="w-[12vw]">
                      <FormLabel>Opening Time</FormLabel>
                      <TimePickerComponent
                        value={openingTime}
                        onValueChange={(val) => {
                          setOpeningTime(val)
                        }}
                      />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="endtHours"
                  render={({ field }) => (
                    <FormItem className="w-[12vw]">
                      <FormLabel>Closing Time</FormLabel>
                      <TimePickerComponent
                        value={closingTime}
                        onValueChange={setClosingTime}
                      />
                    </FormItem>
                  )}
                />
                {!editCourtForm && (
                  <div className="flex items-center gap-x-2 pb-2">
                    <Controller
                      name="offDay"
                      control={form.control}
                      render={({ field }) => (
                        <Switch
                          id="offDay"
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked)
                            setIsOffDay(checked)
                          }}
                        />
                      )}
                    />
                    <FormLabel htmlFor="offDay" className="cursor-pointer">
                      Off Day Schedule
                    </FormLabel>
                  </div>
                )}
              </div>

              {/* Row 2: Off Day Schedule (Conditional) */}
              {isOffDay && (
                <div className="rounded-lg border p-4 space-y-4">
                  <p className="text-md font-medium">Off Day Details</p>

                  <div className="flex flex-wrap items-end gap-6">
                    <div className="flex items-center gap-x-2 pb-2">
                      <Controller
                        name="offDayType"
                        control={form.control}
                        render={({ field }) => (
                          <Switch
                            id="offDayType"
                            // Switch is ON if it is "Partial"
                            checked={field.value === "Partial"}
                            onCheckedChange={(checked) => {
                              const newValue = checked ? "Partial" : "Full"
                              field.onChange(newValue)
                              setOffDayType(newValue)
                            }}
                          />
                        )}
                      />
                      <FormLabel htmlFor="offDayType" className="font-bold">
                        {offDayType} Day
                      </FormLabel>
                    </div>

                    {offDayType === "Partial" && (
                      <div className="flex gap-4 animate-in fade-in slide-in-from-left-2">
                        <FormField
                          control={control}
                          name="offDayStartHours"
                          render={({ field }) => (
                            <FormItem className="w-[12vw]">
                              <FormLabel>Start Time</FormLabel>
                              <TimePickerComponent
                                value={field.value} // "HH:mm" string
                                onValueChange={(val) => {
                                  field.onChange(val)
                                  setOffDayStartTime(val)
                                }} // Updates the form state
                              />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name="offDayEndtHours"
                          render={({ field }) => (
                            <FormItem className="w-[12vw]">
                              <FormLabel>End Time</FormLabel>
                              <TimePickerComponent
                                value={field.value}
                                onValueChange={(val) => {
                                  field.onChange(val)
                                  setOffDayEndTime(val)
                                }}
                              />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    <div className="w-[18vw]">
                      <FormLabel>Calendar</FormLabel>
                      {dateTypeValue === "singleDate" ? (
                        <DatePickerComponent
                          value={date}
                          onValueChange={handleDateChange}
                        />
                      ) : (
                        <DateRangePickerComponent
                          value={range}
                          onValueChange={handleRangeChange}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </Form>
          <div className="flex gap-2 justify-end mt-4">
            {/* <Button onClick={() => setStep("FORM")} variant="secondary">
              Back
            </Button> */}
            <Button onClick={handleSubmit(onFinalSubmit)}>Submit</Button>
          </div>
        </div>
      )}
    </div>
  )
}
