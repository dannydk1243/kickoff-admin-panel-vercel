"use client"

import { Key, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { CalendarDays, User, MapPin, CreditCard, Clock, Activity, Hash, Mail, DollarSign, Users, Info } from "lucide-react"

import { DictionaryType } from "@/lib/get-dictionary"
import { useTranslation } from "@/lib/translationContext"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

type CreatorType = {
    _id: string
    name: string
    email: string
    avatar: string | null
}

type CourtType = {
    _id: string
    name: string
    description: string
    sport: string
    location: string
    owner: any
    surface: string
    size: string
    capacity: number
    amenities: string[]
    price: number
    currency: string
    avatar: string
    status: string
    isActive: boolean
    slotDurationMinutes: number
    bufferMinutes: number
    offersTraining: boolean
    isDeleted: boolean
    createdAt: string
    updatedAt: string
    __v: number
}

type BookingType = {
    _id: string
    creator: CreatorType
    court: CourtType
    type: string
    startDatetime: string
    endDatetime: string
    durationMinutes: number
    players: number
    baseAmount: number
    taxes: number
    discountAmount: number
    finalAmount: number
    status: string
    paymentDeadline: string
    createdAt: string
    updatedAt: string
    __v: number
}

type BookingInfoFormProps = {
    onClose?: () => void
    bookingDetails?: any
    dictionary: any
}

export function BookingForm({ onClose, bookingDetails: initialBookingDetails, dictionary }: BookingInfoFormProps) {

    useEffect(() => {
        console.log(initialBookingDetails, 'whole row')
    }, [initialBookingDetails])

    if (!initialBookingDetails) return null
    const bookingDetails = initialBookingDetails?.booking || initialBookingDetails
    const participants = initialBookingDetails?.participants || []
    const training = bookingDetails?.training || initialBookingDetails?.training

    const { creator, court } = bookingDetails

    return (
        <div className="space-y-6">
            {/* Header: Status and ID */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">{dictionary.tableColumnLabels.bookingDetails || "Booking Details"}</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Hash className="h-4 w-4" />
                        <span className="font-mono">{bookingDetails._id}</span>
                    </div>
                </div>
                <Badge className="text-sm px-3 py-1 w-fit" variant={bookingDetails.status === "PENDING" ? "outline" : "default"}>
                    {bookingDetails.status}
                </Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Section 1: Creator Detail */}
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center gap-2 font-semibold text-primary">
                            <User className="h-5 w-5" />
                            <span>{dictionary.dialogFormLabels.creatorInfo || "Creator Information"}</span>
                        </div>
                        <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12 border">
                                <AvatarImage src={creator.avatar || ""} alt={creator.name} />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                    {creator.name.split(" ").map((n: any) => n[0]).join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <p className="font-medium text-lg leading-none">{creator.name}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Mail className="h-3.5 w-3.5" />
                                    <span>{creator.email}</span>
                                </div>
                                <p className="text-xs text-muted-foreground font-mono">ID: {creator._id}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 2: Court Info */}
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center gap-2 font-semibold text-primary">
                            <Activity className="h-5 w-5" />
                            <span>{dictionary.dialogFormLabels.courtInfo || "Court Information"}</span>
                        </div>
                        <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12 border rounded-md">
                                <AvatarImage src={court.avatar} alt={court.name} />
                                <AvatarFallback className="rounded-md">
                                    {court.name[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <p className="font-medium text-lg leading-none">{court.name}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Badge variant="secondary" className="text-[10px] h-4">
                                        {court.sport}
                                    </Badge>
                                    <span className="text-xs">•</span>
                                    <span className="text-xs">{court.surface.replace("_", " ")}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-medium text-primary">
                                    <DollarSign className="h-3 w-3" />
                                    <span>{court.price} {court.currency} / hour</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Section 3: Booking Info */}
            {!training && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 font-semibold text-primary mb-4">
                            <Info className="h-5 w-5" />
                            <span>{dictionary.dialogFormLabels.bookingInfo || "Booking Information"}</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            <InfoTile
                                icon={<Activity className="h-4 w-4" />}
                                label={dictionary.tableColumnLabels.type || "Type"}
                                value={bookingDetails.type}
                            />
                            <InfoTile
                                icon={<Clock className="h-4 w-4" />}
                                label={dictionary.tableColumnLabels.durationMinutes || "Duration"}
                                value={`${bookingDetails.durationMinutes} min`}
                            />
                            <InfoTile
                                icon={<Users className="h-4 w-4" />}
                                label={dictionary.tableColumnLabels.players || "Players"}
                                value={bookingDetails.players.toString()}
                            />
                            <div className="col-span-2 sm:col-span-1">
                                <InfoTile
                                    icon={<CalendarDays className="h-4 w-4" />}
                                    label={dictionary.tableColumnLabels.startDatetime || "Start"}
                                    value={new Date(bookingDetails.startDatetime).toLocaleString()}
                                />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <InfoTile
                                    icon={<CalendarDays className="h-4 w-4" />}
                                    label={dictionary.tableColumnLabels.endDatetime || "End"}
                                    value={new Date(bookingDetails.endDatetime).toLocaleString()}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>)
            }

            {training && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 font-semibold text-primary mb-4">
                            <Activity className="h-5 w-5" />
                            <span>{dictionary.dialogFormLabels?.trainingInfo || "Training Information"}</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            <InfoTile
                                icon={<Activity className="h-4 w-4" />}
                                label={dictionary.tableColumnLabels.type || "Type"}
                                value={bookingDetails.type}
                            />
                            <InfoTile
                                icon={<Clock className="h-4 w-4" />}
                                label={dictionary.tableColumnLabels.durationMinutes || "Duration"}
                                value={`${bookingDetails.durationMinutes} min`}
                            />
                            <InfoTile
                                icon={<Users className="h-4 w-4" />}
                                label={dictionary.tableColumnLabels.players || "Players"}
                                value={bookingDetails.players.toString()}
                            />
                            <InfoTile
                                icon={<CalendarDays className="h-4 w-4" />}
                                label={dictionary.tableColumnLabels.startDatetime || "Start"}
                                value={new Date(bookingDetails.startDatetime).toLocaleString()}
                            />

                            <InfoTile
                                icon={<CalendarDays className="h-4 w-4" />}
                                label={dictionary.tableColumnLabels.endDatetime || "End"}
                                value={new Date(bookingDetails.endDatetime).toLocaleString()}
                            />
                            <InfoTile
                                icon={<Activity className="h-4 w-4" />}
                                label={dictionary.tableColumnLabels?.public || "Public"}
                                value={training.isPublic ? (dictionary.commonLabels?.yes || "Yes") : (dictionary.commonLabels?.no || "No")}
                            />
                            <InfoTile
                                icon={<Users className="h-4 w-4" />}
                                label={dictionary.tableColumnLabels?.seatsFilled || "Seats Filled"}
                                value={`${training.seatsFilled} / ${training.maxParticipants}`}
                            />
                            <InfoTile
                                icon={<DollarSign className="h-4 w-4" />}
                                label={dictionary.tableColumnLabels?.pricePerParticipant || "Price / Participant"}
                                value={`${training.pricePerParticipant} ${court?.currency || ''}`}
                            />
                            <InfoTile
                                icon={<Clock className="h-4 w-4" />}
                                label={dictionary.tableColumnLabels?.paymentTimeLimitMinutes || "Time Limit"}
                                value={`${training.paymentTimeLimitMinutes} min`}
                            />

                        </div>
                    </CardContent>
                </Card>
            )}

            {participants.length > 0 && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 font-semibold text-primary mb-4">
                            <Users className="h-5 w-5" />
                            <span>{dictionary.dialogFormLabels.participants || "Participants"}</span>
                        </div>
                        <div className="space-y-4 overflow-y-auto pr-4 -mr-2" style={{ maxHeight: '228px' }}>
                            {participants.map((p: any) => (
                                <div key={p._id} className="flex items-center gap-4">
                                    <Avatar className="h-10 w-10 border">
                                        <AvatarImage src={p.user?.avatar || ""} alt={p.user?.name} />
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {p.user?.name?.split(" ").map((n: string) => n[0]).join("") || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <p className="font-medium text-sm leading-none">{p.user?.name}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>{p.user?.email}</span>
                                        </div>
                                    </div>
                                    <div className="ml-auto flex items-center gap-3">
                                        <div className="flex flex-col items-end gap-1 border-r pr-3">
                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 uppercase">
                                                {p.role}
                                            </Badge>
                                            <Badge variant={p.paymentStatus === "UNPAID" ? "destructive" : "default"} className="text-[10px] px-1.5 py-0 uppercase">
                                                {p.paymentStatus}
                                            </Badge>
                                        </div>
                                        <span className="font-bold text-sm text-primary w-20 text-right">{p.amount} {court.currency}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {participants.length > 0 && (
                            <>
                                <Separator className="my-4" />
                                <div className="flex justify-between items-center pt-1">
                                    <span className="font-bold text-sm">{dictionary.dialogFormLabels?.totalAmountPaid || "Total Amount Paid"}</span>
                                    <span className="font-bold text-sm text-green-600">
                                        {participants.reduce((sum: number, p: any) => sum + (p.paymentStatus === 'PAID' ? p.amount : 0), 0)} {court?.currency || ''}
                                    </span>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Section 4: Financial Breakdown */}
            <Card className="bg-primary/[0.02]">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2 font-semibold text-primary mb-4">
                        <CreditCard className="h-5 w-5" />
                        <span>{dictionary.dialogFormLabels.financialBreakdown || "Financial Breakdown"}</span>
                    </div>
                    <div className="space-y-2">
                        {/* <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{dictionary.dialogFormLabels.baseAmount || "Base Amount"}</span>
                            <span>{bookingDetails.baseAmount} {court.currency}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{dictionary.dialogFormLabels.taxes || "Taxes"}</span>
                            <span>+ {bookingDetails.taxes} {court.currency}</span>
                        </div>
                        <div className="flex justify-between text-sm text-green-600">
                            <span>{dictionary.dialogFormLabels.discountAmount || "Discount"}</span>
                            <span>- {bookingDetails.discountAmount} {court.currency}</span>
                        </div> */}
                        <Separator className="my-2" />
                        <div className="flex justify-between items-center pt-1">
                            <span className="font-bold text-lg">{dictionary.dialogFormLabels.finalAmount || "Total Amount"}</span>
                            <span className="font-bold text-xl text-primary">{bookingDetails.baseAmount} {court.currency}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Section 5: Timestamps and Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[10px] text-muted-foreground uppercase tracking-wider">
                <div className="flex flex-col gap-1 border-l-2 pl-3">
                    <span>{dictionary.tableColumnLabels.sentOn || "Created At"}</span>
                    <span className="font-medium text-foreground">{new Date(bookingDetails.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex flex-col gap-1 border-l-2 pl-3">
                    <span>{dictionary.dialogFormLabels.paymentDeadline || "Payment Deadline"}</span>
                    <span className="font-medium text-foreground">{new Date(bookingDetails.paymentDeadline).toLocaleString()}</span>
                </div>
                <div className="flex flex-col gap-1 border-l-2 pl-3">
                    <span>{dictionary.dialogFormLabels.updatedAt || "Last Updated"}</span>
                    <span className="font-medium text-foreground">{new Date(bookingDetails.updatedAt).toLocaleString()}</span>
                </div>
            </div>


            {/* <div className="pt-4 flex justify-end">
                <Button onClick={onClose} variant="secondary">
                    {dictionary.dialogFormLabels.close || "Close"}
                </Button>
            </div> */}
        </div>
    )
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {icon}
                <span>{label}</span>
            </div>
            <p className="text-sm font-semibold">{value}</p>
        </div>
    )
}
