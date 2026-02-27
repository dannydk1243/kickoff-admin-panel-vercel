"use client"

import { Key, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { format } from "date-fns"
import Cookies from "js-cookie"
import { DateRange } from "react-day-picker"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { Check, PlusCircle, Trash2, X } from "lucide-react"

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
import { AdvancedCourtCalendar } from "@/components/ui/multi-date-range-picker"
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
  deleteCourtUnavailability,
  getCourtAvailability,
  getCourtById,
  getCourtUnavailability,
  getOnlyAllowedOwners,
  updateCourtStatus,
  updateCourtUnvalaibility,
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
  offDays?: {
    unavailabilityId?: string
    id?: string
    offDayType: string
    offDayStartHours?: string
    offDayEndtHours?: string
    range: any // Or your specific Date Range type
  }[]
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
  callback?: () => void
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
  callback,
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

  let { createCourt, courtName, editCourt, courtOwner, sportType, surfaceType, courtSize, courtType, titleImage, courtPictures, description } = dictionary.courtLabel

  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(
    null
  )

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
    { label: dictionary.amenitiesLabel.parking, value: "PARKING" },
    { label: dictionary.amenitiesLabel.washroom, value: "WASHROOM" },
    { label: dictionary.amenitiesLabel.shower, value: "SHOWER" },
    { label: dictionary.amenitiesLabel.acHeating, value: "AC_HEATING" },
    { label: dictionary.amenitiesLabel.changingRoom, value: "CHANGING_ROOM" },
    { label: dictionary.amenitiesLabel.firstAid, value: "FIRST_AID" },
    { label: dictionary.amenitiesLabel.water, value: "WATER" },
  ]

  const weekDaysOptions = [
    { label: dictionary.weekDaysLabel.daily, value: "daily" },
    { label: dictionary.weekDaysLabel.mondayToFriday, value: "mondayToFriday" },
    { label: dictionary.weekDaysLabel.mondayToSaturday, value: "mondayToSaturday" },
  ]

  const isSameDate = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()

  let adminData = { role: "", _id: "" }
  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "offDays", // This must match your schema
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value

    // Update state
    setStatusRej(val)

    // Simple validation logic
    if (val.length > 250) {
      setError(dictionary.ErrorMsg.reasonTooLong)
    } else if (val.length === 0) {
      setError(dictionary.ErrorMsg.reasonRequired)
    } else {
      setError("")
    }
  }

  async function handleClick() {
    // 1. Validation Check: Ensure a status is actually selected
    if (!statusDropdown) {
      triggerError(dictionary.ErrorMsg.selectStatus)
      return
    }

    // 2. Validation Check: Ensure reason is provided for rejection
    if (statusDropdown === "REJECTED" && statusRej.trim() === "") {
      setError(dictionary.ErrorMsg.rejectionReasonRequired) // Assuming you have an setError state
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
        if (callback) {
          callback()
        }
        onClose?.() // Close modal for BOTH Approved and Rejected success
      }
    } catch (err) {
      // 5. Handle API Errors
      console.error("Failed to update status:", err)
      triggerError(dictionary.ErrorMsg.genericError)
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

  const isLoaded = useRef(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    // If we are within 10px of the bottom and there is more data to load
    if (scrollHeight - scrollTop <= clientHeight + 10 && hasMore) {
      setPage((prev) => prev + 1)
    }
  }

  useEffect(() => {
    const fetchOffDays = async () => {
      if (!courtId) return // Guard inside the effect, not around the hook

      try {
        const data = await getCourtUnavailability(courtId, page)
        if (data?.courtUnavailability) {
          const formattedNewDays = data.courtUnavailability.map(
            (item: any) => ({
              unavailabilityId: item._id,
              offDayType:
                item.scope.charAt(0) + item.scope.slice(1).toLowerCase(),
              offDayStartHours: format(new Date(item.startDatetime), "HH:mm"),
              offDayEndtHours: format(new Date(item.endDatetime), "HH:mm"),
              range: {
                from: new Date(item.startDatetime),
                to: new Date(item.endDatetime),
              },
              id: item._id,
            })
          )

          if (page === 1) {
            replace(formattedNewDays)
          } else {
            const existingIds = new Set(fields.map((f) => f.id))
            const uniqueNewDays = formattedNewDays.filter(
              (day: { id: string }) => !existingIds.has(day.id)
            )
            if (uniqueNewDays.length > 0) append(uniqueNewDays)
          }
          setIsOffDay(true)
          if (data.page >= data.pages) setHasMore(false)
        }
      } catch (error) {
        console.error("Failed to load off days", error)
      }
    }

    fetchOffDays()

    // 2. This array must ALWAYS have these 4 items in this order
  }, [page, courtId, replace, append])

  useEffect(() => {
    // console.log(isOffDay, "string")
    form.setValue("offDay", isOffDay)
  }, [isOffDay, form.setValue])

  useEffect(() => {
    if (!courtId) return
    if (courtId) {
      setEditCourtForm(true)
    }
    const fetchCourt = async () => {
      const [res] = await Promise.all([
        getCourtById(courtId),
        //   getCourtAvailability(courtId),
      ])

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
        // reset(initialValues)
        form.reset({
          ...form.getValues(), // Keep the offDays that might have been fetched already
          ...initialValues,
        })
        // initialValuesRef.current = initialValues
        initialValuesRef.current = form.getValues()

        setSelectedOwner?.(court.owner._id)

        const existingImages: CourtImage[] = attachments.map(
          (img: { url: any; _id: any }, index: number) => ({
            url: img.url,
            isTitle: index === 0,
            imageId: img._id,
          })
        )

        setCourtImages(existingImages)
      } else {
        onClose?.()
      }
      if (!res?.court) return
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

      ; (Object.keys(watchedValues) as FormKeys[]).forEach((key) => {
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
    const value = Cookies.get("adminProfile") ?? ""
    adminData = JSON.parse(value)

    // 3. Update your state
    setUserRole(adminData.role)

    const fetchData = async () => {
      // setLoading(true);
      const res = await getOnlyAllowedOwners()

      if (res?.admins) {
        setAllOwnersList(res.admins)
      } else {
        setAllOwnersList([])
      }
    }

    if (adminData.role === "OWNER") {
      if (adminData._id) {
        setSelectedOwner?.(adminData._id)
      }
    }
    // 3. Otherwise, if they are an ADMIN, they need to see the list to pick one
    else {
      fetchData()
    }
  }, [courtId, userRole, adminData._id, setSelectedOwner])

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

      // if (callback && success) {
      //   callback()
      // }

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
    toast({ variant: "destructive", title: dictionary.ErrorMsg.validationErrorTitle, description })
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
    if (!data.selectedWeekDay) return triggerError(dictionary.ErrorMsg.selectWeekday)
    if (!openingTime || !closingTime)
      return triggerError(dictionary.ErrorMsg.operatingHoursRequired)
    const openMins = parseTimeToMinutes(openingTime)
    const closeMins = parseTimeToMinutes(closingTime)

    if (closeMins <= openMins) {
      return triggerError(dictionary.ErrorMsg.closingTimeError)
    }

    if (closeMins - openMins < 60) {
      return triggerError(dictionary.ErrorMsg.operatingWindowError)
    }
    // 2. Off Day Logic & Restrictions
    let offDayPayload = null

    const offDaysArray = data.offDays || []
    let offDayPayloads = []


    if (isOffDay && offDaysArray.length > 0) {
      for (let i = 0; i < offDaysArray.length; i++) {
        const item = offDaysArray[i]
        const { range, offDayType, offDayStartHours, offDayEndtHours } = item
        const rowNum = i + 1

        // 1. Basic Range Check
        if (!range?.from || !range?.to) {
          return triggerError(`${dictionary.ErrorMsg.selectDatesOffDay} #${rowNum}`)
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const selectedStartDate = new Date(range.from)
        selectedStartDate.setHours(0, 0, 0, 0)

        // 2. Full Day Restriction
        if (
          offDayType === "Full" &&
          selectedStartDate.getTime() === today.getTime()
        ) {
          return triggerError(
            `Off Day #${rowNum}: ${dictionary.ErrorMsg.fullOffDayAdvance}`
          )
        }

        // Default times for Full Day
        let startT = "00:00"
        let endT = "23:59"

        if (offDayType === "Partial") {
          // 3. Presence Check
          if (!offDayStartHours || !offDayEndtHours) {
            return triggerError(
              `Off Day #${rowNum}: ${dictionary.ErrorMsg.partialTimesRequired}`
            )
          }

          const offStartMins = parseTimeToMinutes(offDayStartHours)
          const offEndMins = parseTimeToMinutes(offDayEndtHours)

          // 4. Validity & Logic Check
          if (offStartMins === -1 || offEndMins === -1) {
            return triggerError(`Off Day #${rowNum}: ${dictionary.ErrorMsg.invalidTimeFormat}`)
          }

          if (offStartMins >= offEndMins) {
            return triggerError(
              `Off Day #${rowNum}: ${dictionary.ErrorMsg.startTimeBeforeEndTime}`
            )
          }

          // 5. Business Hours Containment
          if (offStartMins < openMins || offEndMins > closeMins) {
            return triggerError(
              `Off Day #${rowNum} ${dictionary.ErrorMsg.offDayWithinBusinessHours} (${openingTime} - ${closingTime})`
            )
          }

          // 6. Past Time Protection (Today only)
          if (selectedStartDate.getTime() === today.getTime()) {
            const now = new Date()
            const currentTimeMins = now.getHours() * 60 + now.getMinutes()
            if (offStartMins < currentTimeMins) {
              return triggerError(
                `Off Day #${rowNum}: ${dictionary.ErrorMsg.startTimePast}`
              )
            }
          }

          startT = offDayStartHours
          endT = offDayEndtHours
        }

        // 7. Add to Payloads list
        offDayPayloads.push({
          // If the item has an ID from the database, include it for updating
          ...(item.id && { _id: item.id }),
          startDatetime: combineDateAndTimeToISOString(range.from, startT),
          endDatetime: combineDateAndTimeToISOString(range.to, endT),
          scope: offDayType.toUpperCase(),
          exceptionType: "MAINTENANCE", // Assuming default from your API data
          reason: "other",
        })
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
      offDayPayloadData: offDayPayloads,
    }

    try {
      // 1. Prepare the Availability promise (this always runs)
      const availabilityPromise = createCourtAvailability(
        courtResponceId,
        finalPayload?.dailySlots
      )

      let allPromises = [availabilityPromise]

      // 2. If Off-Days exist, create a promise for EACH individual record
      if (isOffDay && finalPayload?.offDayPayloadData?.length > 0) {
        const offDayPromises = finalPayload.offDayPayloadData.map((payload) => {
          // Logic: If payload has an _id, it exists in DB -> Update
          // If it has no _id, it was added manually -> Create
          if (payload._id) {
            return updateCourtUnvalaibility(payload)
          } else {
            return createCourtUnvalaibility(courtResponceId, payload)
          }
        })

        allPromises = [...allPromises, ...offDayPromises]
      }

      const results = await Promise.all(allPromises)

      // 4. Handle results
      // Since results is an array, we check if all calls returned truthy values
      if (results.every((res) => !!res)) {
        toast({
          title: dictionary.courtLabel.successTitle,
          description: dictionary.courtLabel.availabilityUpdated,
        })
      }

      onClose?.()
    } catch (error) {
      console.error("Parallel API Error:", error)
      toast({
        variant: "destructive",
        title: dictionary.courtLabel.updateFailedTitle,
        description:
          dictionary.courtLabel.updateFailedMsg,
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
              {view ? dictionary.courtLabel.viewCourt : !courtId ? createCourt : editCourt}
            </div>
            <div></div>

            <div className="grid grid-cols-4 gap-x-4 gap-y-4 mt-[1.5vh]">
              {/* Name */}
              <div className="h-[8.5vh]">
                <FormField
                  control={control}
                  name="name"
                  rules={{ required: dictionary.ErrorMsg.courtNameIsRequired }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{courtName}*</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={dictionary.placeholder.enterCourtName}
                          disabled={view}
                        />
                      </FormControl>
                      <FormMessage>{errors.name?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {!courtId && userRole !== "OWNER" && (
                <div className="h-[8.5vh]">
                  {/* Owner */}
                  <FormField
                    control={control}
                    name="owner"
                    rules={{ required: dictionary.ErrorMsg.courtOwnerIsRequired }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{courtOwner}*</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={view}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={dictionary.placeholder.selectOwner} />
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
                  rules={{ required: dictionary.ErrorMsg.sportTypeIsRequired }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{sportType}*</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={view}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={dictionary.placeholder.selectSport} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FOOTBALL">{dictionary.courtLabel.football}</SelectItem>
                            <SelectItem value="PADEL">{dictionary.courtLabel.padel}</SelectItem>
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
                  rules={{ required: dictionary.ErrorMsg.surfaceTypeIsRequired }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{surfaceType}*</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={view}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={dictionary.placeholder.selectSurfaceType} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NATURAL_GRASS">
                              {dictionary.courtLabel.naturalGrass}
                            </SelectItem>
                            <SelectItem value="ARTIFICIAL_TURF">
                              {dictionary.courtLabel.artificialTurf}
                            </SelectItem>
                            <SelectItem value="CARPET">{dictionary.courtLabel.carpet}</SelectItem>
                            <SelectItem value="CONCRETE">{dictionary.courtLabel.concrete}</SelectItem>
                            <SelectItem value="WOOD">{dictionary.courtLabel.wood}</SelectItem>
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
                    rules={{ required: dictionary.ErrorMsg.courtSizeIsRequired }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{courtSize}*</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={view}
                            placeholder={dictionary.courtLabel.courtSize}
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
                              <SelectValue placeholder={dictionary.courtLabel.unit} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="m²">{dictionary.courtLabel.meterSquare}</SelectItem>
                              <SelectItem value="YARD">{dictionary.courtLabel.yard}</SelectItem>
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
                  rules={{ required: dictionary.ErrorMsg.sittingCapacityIsRequired }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.courtLabel.capacity}*</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onInput={(e) => {
                            if (view) return
                            const input = e.currentTarget
                            let val = input.value.replace(/[^0-9.]/g, "")
                            input.value = val
                            field.onChange(val)
                          }}
                          disabled={view}
                          placeholder={dictionary.courtLabel.capacity}
                        />
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
                  rules={{ required: dictionary.ErrorMsg.priceIsRequired }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.courtLabel.price}*</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onInput={(e) => {
                            if (view) return
                            const input = e.currentTarget
                            let val = input.value.replace(/[^0-9.]/g, "")
                            input.value = val
                            field.onChange(val)
                          }}
                          disabled={view}
                          placeholder={dictionary.courtLabel.price}
                        />
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
                  rules={{ required: dictionary.ErrorMsg.mapUrlIsRequired }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.courtLabel.mapUrl}*</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={view}
                          placeholder={dictionary.courtLabel.mapUrl}
                        />
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
                  rules={{ required: dictionary.ErrorMsg.cityIsRequired }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.courtLabel.city}*</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={dictionary.courtLabel.city} disabled={view} />
                      </FormControl>
                      <FormMessage>{errors.city?.message}</FormMessage>
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
                      <FormLabel>{dictionary.courtLabel.area}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={dictionary.courtLabel.area} disabled={view} />
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
                      <FormLabel>{dictionary.dialogFormLabels.address}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={dictionary.dialogFormLabels.address}
                          disabled={view}
                        />
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
                <FormLabel>{dictionary.courtLabel.offersTraining}</FormLabel>
              </div>
              {view && (
                <div className="flex items-center gap-x-2 mb-[1vh]">
                  <Button
                    type="button"
                    onClick={() => {
                      setStep("SLOT")
                    }}
                  >
                    {dictionary.courtLabel.showTimings}
                  </Button>
                </div>
              )}
            </div>

            <div className=" text-[0.94vw] font-bold">{dictionary.courtLabel.amenities}</div>

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
                  rules={{ required: dictionary.ErrorMsg.titleImageIsRequired }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{titleImage}*</FormLabel>
                      <FormControl>
                        <TitleImageUpload
                          disabled={view}
                          value={field?.value}
                          onChange={field.onChange}
                          dictionary={dictionary}
                        />
                      </FormControl>
                      <FormMessage>{errors.mapUrl?.message}</FormMessage>
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
                      <FormLabel>{courtPictures}</FormLabel>
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
                            dictionary={dictionary}
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
                  rules={{ required: dictionary.ErrorMsg.descriptionIsRequired }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{description}*</FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          disabled={view}
                          rows={6}
                          className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
                        />
                      </FormControl>
                      <FormMessage>{errors.mapUrl?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* {view && (
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
            )} */}

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
                            <SelectValue placeholder={dictionary.courtLabel.status} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="REJECTED">{dictionary.courtLabel.rejected}</SelectItem>
                          <SelectItem value="APPROVED">{dictionary.courtLabel.approved}</SelectItem>
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
                      placeholder={dictionary.courtLabel.rejectionReasonPlaceholder}
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
                  {dictionary.courtLabel.update}
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
                      <Button type="submit">{dictionary.btnText.save}</Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleReset}
                      >
                        {dictionary.btnText.reset}
                      </Button>
                    </>
                  )
                ) : (
                  <Button type="submit">{dictionary.courtLabel.createCourt}</Button>
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
          <p className="text-lg font-semibold">{dictionary.courtLabel.bookYourSlot}</p>
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
                        <FormLabel>{dictionary.courtLabel.days}</FormLabel>
                        <Select
                          disabled={view}
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={dictionary.courtLabel.selectWeekdayPlaceholder} />
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
                      <FormLabel>{dictionary.courtLabel.openingTime}</FormLabel>
                      <TimePickerComponent
                        disabled={view}
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
                      <FormLabel>{dictionary.courtLabel.closingTime}</FormLabel>
                      <TimePickerComponent
                        disabled={view}
                        value={closingTime}
                        onValueChange={setClosingTime}
                      />
                    </FormItem>
                  )}
                />

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
                        disabled={view}
                      />
                    )}
                  />
                  <FormLabel htmlFor="offDay" className="cursor-pointer">
                    {dictionary.courtLabel.offDaySchedule}
                  </FormLabel>
                </div>
              </div>

              {/* Row 2: Off Day Schedule (Conditional) */}
              {isOffDay && (
                // <div className="rounded-lg border p-4 space-y-4">
                //   <p className="text-md font-medium">Off Day Details</p>

                //   <div className="flex flex-wrap items-end gap-6">
                //     <div className="flex items-center gap-x-2 pb-2">
                //       <Controller
                //         name="offDayType"
                //         control={form.control}
                //         render={({ field }) => (
                //           <Switch
                //             id="offDayType"
                //             // Switch is ON if it is "Partial"
                //             checked={field.value === "Partial"}
                //             onCheckedChange={(checked) => {
                //               const newValue = checked ? "Partial" : "Full"
                //               field.onChange(newValue)
                //               setOffDayType(newValue)
                //             }}
                //           />
                //         )}
                //       />
                //       <FormLabel htmlFor="offDayType" className="font-bold">
                //         {offDayType} Day
                //       </FormLabel>
                //     </div>

                //     {offDayType === "Partial" && (
                //       <div className="flex gap-4 animate-in fade-in slide-in-from-left-2">
                //         <FormField
                //           control={control}
                //           name="offDayStartHours"
                //           render={({ field }) => (
                //             <FormItem className="w-[12vw]">
                //               <FormLabel>Start Time</FormLabel>
                //               <TimePickerComponent
                //                 value={field.value} // "HH:mm" string
                //                 onValueChange={(val) => {
                //                   field.onChange(val)
                //                   setOffDayStartTime(val)
                //                 }} // Updates the form state
                //               />
                //             </FormItem>
                //           )}
                //         />
                //         <FormField
                //           control={control}
                //           name="offDayEndtHours"
                //           render={({ field }) => (
                //             <FormItem className="w-[12vw]">
                //               <FormLabel>End Time</FormLabel>
                //               <TimePickerComponent
                //                 value={field.value}
                //                 onValueChange={(val) => {
                //                   field.onChange(val)
                //                   setOffDayEndTime(val)
                //                 }}
                //               />
                //             </FormItem>
                //           )}
                //         />
                //       </div>
                //     )}

                //     <div className="w-[18vw]">
                //       <FormLabel>Calendar</FormLabel>
                //       {/* {dateTypeValue === "singleDate" ? (
                //         <DatePickerComponent
                //           value={date}
                //           onValueChange={handleDateChange}
                //         />
                //       ) : ( */}
                //       <DateRangePickerComponent
                //         value={range}
                //         onValueChange={handleRangeChange}
                //       />
                //       {/* )} */}
                //     </div>
                //   </div>
                // </div>
                <div className="space-y-6">
                  <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar space-y-6"
                  >
                    {fields.map((field, index) => {
                      // Get all ranges EXCEPT the one for this specific row
                      const allOffDays = form.watch("offDays") || []
                      const otherRanges = allOffDays
                        .filter((_, i) => i !== index) // Don't exclude the current row's own range
                        .map((item) => item.range)
                        .filter(Boolean) // Remove undefined/nulls
                      const isConfirming = pendingDeleteIndex === index

                      return (
                        <div
                          key={field.id}
                          className="relative rounded-lg border p-4 space-y-4"
                        >
                          <div className="flex justify-between items-center">
                            <p className="text-md font-medium">
                              {dictionary.courtLabel.offDayDetails} #{index + 1}
                            </p>
                            {/* {fields.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemove(index)}
                              className="text-red-500"
                            >
                              Remove
                            </Button>
                          )} */}
                            {!view && (
                              <>
                                {isConfirming ? (
                                  <div className="flex items-center gap-2 animate-in zoom-in-95">
                                    <span className="text-xs font-medium text-destructive">
                                      {dictionary.courtLabel.confirm}
                                    </span>
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="outline"
                                      className="h-8 w-8 border-green-500 text-green-600 "
                                      onClick={async () => {
                                        const fieldToDelete = fields[index]

                                        // 1. If the item has an ID, it exists in the database
                                        if (fieldToDelete.unavailabilityId) {
                                          const success =
                                            await deleteCourtUnavailability(
                                              fieldToDelete.unavailabilityId
                                            )
                                          if (!success) return
                                        }
                                        remove(index)
                                        setPendingDeleteIndex(null)
                                      }}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="outline"
                                      className="h-8 w-8 border-muted text-muted-foreground "
                                      onClick={() => {
                                        setPendingDeleteIndex(null)
                                      }}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                    onClick={() => setPendingDeleteIndex(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </>
                            )}
                          </div>

                          <div className="flex flex-wrap items-end gap-6">
                            {/* Off Day Type Switch */}
                            <div className="flex items-center gap-x-2 pb-2">
                              <Controller
                                name={`offDays.${index}.offDayType`}
                                control={form.control}
                                render={({ field: switchField }) => (
                                  <Switch
                                    id={`offDayType-${index}`}
                                    checked={switchField.value === "Partial"}
                                    onCheckedChange={(checked) => {
                                      switchField.onChange(
                                        checked ? "Partial" : "Full"
                                      )
                                    }}
                                    disabled={view}
                                  />
                                )}
                              />
                              <FormLabel
                                htmlFor={`offDayType-${index}`}
                                className="font-bold"
                              >
                                {form.watch(`offDays.${index}.offDayType`) ===
                                  "Partial"
                                  ? dictionary.courtLabel.partialDay
                                  : dictionary.courtLabel.fullDay}
                              </FormLabel>
                            </div>

                            {/* Partial Day Time Pickers */}
                            {form.watch(`offDays.${index}.offDayType`) ===
                              "Partial" && (
                                <div className="flex gap-4 animate-in fade-in slide-in-from-left-2">
                                  <FormField
                                    control={form.control}
                                    name={`offDays.${index}.offDayStartHours`}
                                    render={({ field }) => (
                                      <FormItem className="w-[12vw]">
                                        <FormLabel>{dictionary.courtLabel.startTime}</FormLabel>
                                        <TimePickerComponent
                                          value={field.value}
                                          onValueChange={field.onChange}
                                          disabled={view}
                                        />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name={`offDays.${index}.offDayEndtHours`}
                                    render={({ field }) => (
                                      <FormItem className="w-[12vw]">
                                        <FormLabel>{dictionary.courtLabel.endTime}</FormLabel>
                                        <TimePickerComponent
                                          value={field.value}
                                          onValueChange={field.onChange}
                                          disabled={view}
                                        />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              )}

                            {/* Calendar Range Picker */}
                            <div className="w-[18vw]">
                              <FormField
                                control={form.control}
                                name={`offDays.${index}.range`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>{dictionary.courtLabel.calendar}</FormLabel>
                                    <DateRangePickerComponent
                                      value={field.value}
                                      onValueChange={field.onChange}
                                      excludeRanges={otherRanges}
                                      pickerDisabled={view}
                                    />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {/* The Plus Button */}
                  {!view && (
                    <button
                      type="button"
                      onClick={() =>
                        append({
                          offDayType: "Full",
                          offDayStartHours: "",
                          offDayEndtHours: "",
                          range: null,
                        })
                      }
                      className="w-full py-3 border-2 border-dashed rounded-lg flex items-center justify-center gap-2 hover:bg-accent transition-colors"
                    >
                      <PlusCircle className="h-5 w-5" />
                      <span>{dictionary.courtLabel.addOffDay}</span>
                    </button>
                  )}
                </div>
              )}
            </form>
          </Form>
          {/* <AdvancedCourtCalendar
            existingData={unavail.courtUnavailability}
            onAddSelection={(newRange: any) => {
              
              // You can call your availability check functions here
            }}
          /> */}
          <div className="flex gap-2 justify-end mt-4">
            {view ? (
              <Button onClick={() => setStep("FORM")} variant="secondary">
                {dictionary.btnText.back}
              </Button>
            ) : (
              <Button onClick={handleSubmit(onFinalSubmit)}>{dictionary.btnText.submit}</Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
