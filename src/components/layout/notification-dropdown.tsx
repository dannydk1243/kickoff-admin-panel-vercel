"use client"

import { useEffect, useRef, useState } from "react"
import { CustomLoader } from "@/app/[lang]/(dashboard-layout)/(design-system)/ui/loader/page"
import Cookies from "js-cookie"
import { Bell } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"

import { socketInstance } from "@/lib/socket-singleton"
import { formatDistance } from "@/lib/utils"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  getAllNotifications,
  readAllNotifications,
} from "@/components/dashboards/services/apiService"

interface Notification {
  _id: string
  senderType: string
  sender: string
  category: string
  title: string
  message: string
  audience: string
  createdAt: string
  updatedAt: string
}

export function NotificationDropdown({
  dictionary,
  initialData = { notifications: [], unreadCount: 0, pages: 0 },
}: {
  dictionary: DictionaryType
  initialData?: {
    notifications: Notification[]
    unreadCount: number
    pages: number
  }
}) {
  const [notifications, setNotifications] = useState<Notification[]>(
    initialData.notifications
  )
  const [unreadCount, setUnreadCount] = useState(initialData.unreadCount)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialData.pages > 1)
  const [isLoading, setIsLoading] = useState(false)
  const socket = socketInstance
  const observerTarget = useRef(null)

  // 1. Handle Popover State (Open/Close logic)
  const handleOpenChange = async (open: boolean) => {
    if (open) {
      // Triggered when opening: Refresh to Page 1
      await refreshToPageOne()
    } else {
      // Triggered when closing
      const readResponse = await readAllNotifications()
      if (readResponse) {
        setUnreadCount(0)
      }
      // You can call an actual API here to mark items as read if needed
    }
  }

  // 2. Logic to reset and get the latest data
  const refreshToPageOne = async () => {
    setIsLoading(true)
    try {
      const response = await getAllNotifications(1)
      if (response) {
        setNotifications(response.notifications)
        setUnreadCount(
          (response.unreadCounts.generalNotification ?? 0) +
            (response.unreadCounts.announcementNotification ?? 0)
        )
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
    setUnreadCount(initialData.unreadCount)
  }, [initialData.unreadCount])

  useEffect(() => {
    if (!socket) return

    socket.on("broadcast-announcement", (data: any) => {
      setUnreadCount((prev) => prev + 1)
    })

    socket.on("general-notification", (data: any) => {
      setUnreadCount((prev) => prev + 1)
    })

    socket.on("connect_error", (err: { message: any }) => {
      console.error("Socket Connection Error:", err.message)
    })

    // 3. Cleanup
    return () => {
      socket.off("broadcast-announcement")
      socket.off("general-notification")
    }
  }, [socket])
  // 3. Keep existing scroll logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          await loadMoreNotifications()
        }
      },
      { threshold: 1.0 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoading, page])

  const loadMoreNotifications = async () => {
    setIsLoading(true)
    const nextPage = page + 1

    try {
      const response = await getAllNotifications(nextPage)
      if (response && response.notifications.length > 0) {
        setNotifications((prev) => [...prev, ...response.notifications])
        setPage(nextPage)
        setHasMore(nextPage < response.pages)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error loading notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Popover modal onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -end-1 h-4 min-w-4 px-1 flex justify-center text-[10px]"
              variant="destructive"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[380px] p-0" align="end">
        <Card className="border-0 shadow-none">
          <div className="flex items-center justify-between border-b border-border p-3 font-semibold text-sm">
            {dictionary.navigation.notifications.notifications}
          </div>

          <ScrollArea className="h-[400px]">
            {notifications && notifications.length > 0 ? (
              <ul className="flex flex-col">
                {notifications.map((item) => (
                  <li
                    key={item._id}
                    className="border-b border-border last:border-0"
                  >
                    <div className="flex items-start gap-3 py-4 px-4 hover:bg-accent transition-colors">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>
                          {item.sender?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {item.message}
                        </p>
                        {/* <p className="text-[10px] text-muted-foreground pt-1">
                          {formatDistance(item.createdAt)}
                        </p> */}
                      </div>
                    </div>
                  </li>
                ))}
                {/* Sentinel for infinite scroll */}
                <div
                  ref={observerTarget}
                  className="h-10 flex items-center justify-center"
                >
                  {isLoading && page > 1 && (
                    <span className="text-[10px] text-muted-foreground">
                      Loading...
                    </span>
                  )}
                </div>
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-sm">
                  {isLoading ? <CustomLoader /> : "No notifications yet"}
                </div>
              </div>
            )}
          </ScrollArea>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
