"use client"

import { useParams } from "next/navigation"

import type { DictionaryType } from "@/lib/get-dictionary"
import type { AdminProfile, LocaleType } from "@/types"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { LanguageDropdown } from "@/components/language-dropdown"
import { FullscreenToggle } from "@/components/layout/full-screen-toggle"
import { NotificationDropdown } from "@/components/layout/notification-dropdown"
import { UserDropdown } from "@/components/layout/user-dropdown"
import { ModeDropdown } from "@/components/mode-dropdown"
import { ToggleMobileSidebar } from "../toggle-mobile-sidebar"
import { getAnnouncementCount } from "@/components/dashboards/services/apiService" 
import { useEffect, useState } from "react"

export function VerticalLayoutHeader({
  dictionary,
  adminData
}: {
  dictionary: DictionaryType
  adminData: AdminProfile | null
}) {
  const params = useParams()

  const locale = params.lang as LocaleType
  const [notifications, setNotification] = useState({ announcements:[], unreadCount: 0, pages: 0 })
 
  useEffect(() => {
  // Define the async function inside
  const fetchAnnouncements = async () => {
    try {
      const response = await getAnnouncementCount();
      setNotification({ announcements:[], unreadCount: response?.unreadCount ?? 0, pages: 0 });
    } catch (error) {
      console.error("Failed to fetch Notification:", error);
    }
  };

  fetchAnnouncements();
}, []); // Empty array ensures this runs once on mount

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-sidebar-border">
      <div className="container flex h-14 justify-between items-center gap-4">
        <ToggleMobileSidebar />
        <div className="grow flex justify-end gap-2">
          <SidebarTrigger className="hidden lg:flex lg:me-auto" />
          <NotificationDropdown dictionary={dictionary} initialData={notifications} />
          <FullscreenToggle />
          <ModeDropdown dictionary={dictionary} />
          <LanguageDropdown dictionary={dictionary} />
          {/* <UserDropdown dictionary={dictionary} locale={locale} adminData={adminData} /> */}
        </div>
      </div>
    </header>
  )
}
