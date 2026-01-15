"use client"

import { useEffect, useRef, useState } from "react"
import Cookies from "js-cookie"
import { Bell } from "lucide-react"

import type { DictionaryType } from "@/lib/get-dictionary"

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
  getAllAnnouncements,
  readAllAnnouncements,
} from "@/components/dashboards/services/apiService"
import { io } from "socket.io-client"

interface Announcement {
  _id: string
  title: string
  message: string
  sender: { name: string; email: string }
  type: string
  createdAt: string
}

export function NotificationDropdown({
  dictionary,
  initialData,
}: {
  dictionary: DictionaryType
  initialData: {
    announcements: Announcement[]
    unreadCount: number
    pages: number
  }
}) {
  const [notifications, setNotifications] = useState<Announcement[]>(
    initialData.announcements
  )
  const [unreadCount, setUnreadCount] = useState(initialData.unreadCount)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialData.pages > 1)
  const [isLoading, setIsLoading] = useState(false)

  const observerTarget = useRef(null)

  // 1. Handle Popover State (Open/Close logic)
  const handleOpenChange = async (open: boolean) => {
    if (open) {
      // Triggered when opening: Refresh to Page 1
      await refreshToPageOne()
    } else {
      // Triggered when closing
      const readResponse = await readAllAnnouncements()
      if (readResponse) {
        setUnreadCount(0)
      }
      console.log("read all")
      // You can call an actual API here to mark items as read if needed
    }
  }

  // 2. Logic to reset and get the latest data
  const refreshToPageOne = async () => {
    setIsLoading(true)
    try {
      const response = await getAllAnnouncements(1)
      if (response) {
        setNotifications(response.announcements)
        setUnreadCount(response.unreadCount)
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
    const value = Cookies.get("accessToken") ?? ""
    console.log(value)

    // If no token is present, don't attempt connection
    if (!value) return

    // 1. Initialize the socket connection
    // const socket = io("ws://10.60.0.103:5000", {
    //   path: "/realtime",
    //   addTrailingSlash: false, // Prevents appending /socket.io/ to your path
    //   // extraHeaders: {

    //   //   "x-api-key": "LOC74LJ@qG3sBkSNWXMa0^&7Mvb3Ahg!ZQh3pEOg",
    //   // },
    //   transports: ["websocket"],
    //   secure: true,
    // });

    const socket = io("https://kickoff.narsunprojects.com/realtime", {
      autoConnect: true, // manually connect
      extraHeaders: {
        Authorization: `Bearer ${value}`,
        "x-api-key": "LOC74LJ@qG3sBkSNWXMa0^&7Mvb3Ahg!ZQh3pEOg",
      },
      secure: true,
    })

    // 2. Event Listeners
    socket.on("connect", () => {
      console.log("Connected to /realtime. Socket ID:", socket.id)
    })

    socket.on("broadcast-message", (data) => {
      console.log("New announcement received:", data)
      setUnreadCount((prev) => prev + 1)
    })

    socket.on("connect_error", (err) => {
      // If it still fails, check the Network Tab for the exact URL being called
      console.error("Socket Connection Error:", err.message)
    })

    // 3. Cleanup
    return () => {
      socket.off("broadcast-message")
      socket.disconnect()
    }
  }, [])
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
      const response = await getAllAnnouncements(nextPage)
      if (response && response.announcements.length > 0) {
        setNotifications((prev) => [...prev, ...response.announcements])
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
                          {item.sender?.name?.charAt(0).toUpperCase() || "U"}
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
                <p className="text-sm">
                  {isLoading ? "Fetching latest..." : "No notifications yet"}
                </p>
              </div>
            )}
          </ScrollArea>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
