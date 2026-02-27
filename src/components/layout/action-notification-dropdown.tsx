"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Cookies from "js-cookie"
import { BellPlus, Check, UserPlus, X } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"

import { socketInstance } from "@/lib/socket-singleton"
import { formatDistance } from "@/lib/utils"

import { toast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  getAllPendingCourts,
  updateCourtStatus,
} from "@/components/dashboards/services/apiService"
import { Input } from "../ui/input"
import { io } from "socket.io-client"
import { CustomLoader } from "@/app/[lang]/(dashboard-layout)/(design-system)/ui/loader/page"

export function ActionNotificationDropdown({
  dictionary,
  adminData,
}: {
  dictionary: DictionaryType
  adminData: any
}) {
  const [courtRequests, setCourtRequests] = useState<any[]>()
  const [unreadCountActions, setUnreadCountActions] = useState(0)

  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")

  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const socket = socketInstance
  const observerTarget = useRef(null)

  // 1. Handle Popover State (Open/Close logic)
  const handleOpenChange = async (open: boolean) => {
    if (open) {
      await refreshToPageOne()
    } else {
      // Triggered when closing
      setUnreadCountActions(0)
    }
  }

  // 2. Logic to reset and get the latest data
  const refreshToPageOne = async () => {
    setIsLoading(true)
    try {
      const response = await getAllPendingCourts(1)
      if (response) {
        setCourtRequests(response.courts)
        setUnreadCountActions(0)
        setPage(1)
        setHasMore(1 < response.pages)
      }
    } catch (error) {
      console.error("Error refreshing notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const getInitialData = async function () {
      const readResponse = await getAllPendingCourts()
      if (readResponse) {
        setUnreadCountActions(readResponse.total)
      }
    }
    getInitialData()
  }, [])

  useEffect(() => {
    if (!socket) return
    if (adminData.role !== "OWNER") {
      socket.on("court-notification", (data) => {
        setUnreadCountActions((prev) => prev + 1)
      })
    }

    socket.on("connect_error", (err) => {
      console.error("Socket Connection Error:", err.message)
    })

    // 3. Cleanup
    return () => {
      socket.off("court-notification")
    }
  }, [socket])

  // 3. Keep existing scroll logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          await loadMoreRequests()
        }
      },
      { threshold: 1.0 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoading, page])

  const loadMoreRequests = async () => {
    setIsLoading(true)
    const nextPage = page + 1

    try {
      const response = await getAllPendingCourts(nextPage)
      if (response && response.courts.length > 0) {
        setCourtRequests((prev) => {
          const currentRequests = prev ?? []
          const newRequests = response?.courts ?? []
          return [...currentRequests, ...newRequests]
        })
        setPage(nextPage)
        setHasMore(nextPage < response.pages)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error loading requests:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const triggerError = (description: string) => {
    toast({ variant: "destructive", title: dictionary.ErrorMsg.validationErrorTitle, description })
  }

  const handleReject = async function (id: any, reason: string) {
    if (reason.trim() != "") {
      const body = {
        courtId: id,
        status: "REJECTED",
        feedback: reason,
      }
      const cres = await updateCourtStatus(body)
      if (cres) {
        setCourtRequests((prev) => prev?.filter((item) => item._id !== id))
        setRejectingId(null)
        setRejectionReason("")
      }
    } else {
      return triggerError(dictionary.ErrorMsg.stateReasonOrRejection)
    }
  }

  const handleApprove = async function (id: any) {
    const body = {
      courtId: id,
      status: "APPROVED",
    }
    const cres = await updateCourtStatus(body)
    if (cres) {
      // Remove from local array
      setCourtRequests((prev) => prev?.filter((item) => item._id !== id))
    }
  }

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <UserPlus className="size-4" />
          {unreadCountActions > 0 && (
            <Badge
              className="absolute -top-1 -end-1 h-4 min-w-4 px-1 flex justify-center text-[10px]"
              variant="destructive"
            >
              {unreadCountActions > 99 ? "99+" : unreadCountActions}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[450px] p-0" align="end">
        {" "}
        {/* Increased width */}
        <Card className="border-0 shadow-none">
          <div className="flex items-center justify-between border-b border-border p-3 font-semibold text-sm">
            {dictionary.navigation.courtApproval}
          </div>

          <ScrollArea className="h-[400px]">
            {courtRequests && courtRequests.length > 0 ? (
              <ul className="flex flex-col">
                {courtRequests?.map((item) => {
                  const isRejecting = rejectingId === item._id

                  return (
                    <li
                      key={item._id}
                      className="border-b border-border last:border-0 relative"
                    >
                      <div
                        className={`transition-colors ${isRejecting ? "bg-muted/30" : "hover:bg-accent"}`}
                      >
                        <Link
                          href={`/pages/courts?id=${item._id}`}
                          className={`block p-4 ${isRejecting ? "pointer-events-none opacity-50" : ""}`}
                          onClick={(e) => isRejecting && e.preventDefault()}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage
                                src={item.avatar}
                                alt={item.sender?.name || "User"}
                                className="object-cover"
                              />

                              {/* Fallback only shows if the image is missing or errors out */}
                              <AvatarFallback>
                                {item.sender?.name?.charAt(0).toUpperCase() ||
                                  "U"}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-1 pr-24">
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {item.owner.name} {dictionary.notifications.hasRequested} &nbsp;
                                {item.name} {dictionary.notifications.forApproval}
                              </p>
                            </div>
                          </div>
                        </Link>

                        {/* Rejection Input UI */}
                        {isRejecting && (
                          <div className="px-4 pb-4 flex items-center gap-2">
                            <Input
                              autoFocus
                              placeholder={dictionary.placeholder.reasonForRejection}
                              className="h-8 text-xs"
                              value={rejectionReason}
                              onChange={(e) =>
                                setRejectionReason(e.target.value)
                              }
                            />
                            <Button
                              size="sm"
                              className="h-8 px-3 text-xs"
                              onClick={() => {
                                handleReject(item._id, rejectionReason)
                                setRejectingId(null)
                                setRejectionReason("")
                              }}
                            >
                              {dictionary.btnText.send}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setRejectingId(null)
                                setRejectionReason("")
                              }}
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Default Action Buttons (hidden during rejection) */}
                      {!isRejecting && (
                        <div className="absolute right-4 top-4 flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 rounded-full"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleApprove(item._id)
                            }}
                          >
                            <Check className="h-4 w-4 text-green-500" />
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 rounded-full"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setRejectingId(item._id)
                            }}
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      )}
                    </li>
                  )
                })}
                {/* Infinite Scroll Sentinel */}
                <div
                  ref={observerTarget}
                  className="h-10 flex items-center justify-center"
                >
                  {isLoading && page > 1 && (
                    <span className="text-[10px] text-muted-foreground">
                      {dictionary.navigation.loading}
                    </span>
                  )}
                </div>
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-sm">
                  {isLoading ? <CustomLoader /> : dictionary.notifications.noRequests}
                </div>
              </div>
            )}
          </ScrollArea>
        </Card>
      </PopoverContent>
    </Popover>
  )
}