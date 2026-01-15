import type { i18n } from "@/configs/i18n"
import type { LucideIcon, icons } from "lucide-react"
import type { ComponentType, SVGAttributes } from "react"
import type { z } from "zod"
import type { radii, themes } from "./configs/themes"
import type { ComingSoonSchema } from "./schemas/coming-soon-schema"
import type { ForgotPasswordSchema } from "./schemas/forgot-passward-schema"
import type { NewPasswordSchema } from "./schemas/new-passward-schema"
import type { RegisterSchema } from "./schemas/register-schema"
import type { SignInSchema } from "./schemas/sign-in-schema"
import type { VerifyEmailSchema } from "./schemas/verify-email-schema"

export type LayoutType = "vertical" | "horizontal"

export type ModeType = "light" | "dark" | "system"

export type OrientationType = "vertical" | "horizontal"

export type DirectionType = "ltr" | "rtl"

export type LocaleType = (typeof i18n)["locales"][number]

export type ThemeType = keyof typeof themes

export type RadiusType = (typeof radii)[number]

export type SettingsType = {
  theme: ThemeType
  mode: ModeType
  radius: RadiusType
  layout: LayoutType
  locale: LocaleType
}

export interface IconProps extends SVGAttributes<SVGElement> {
  children?: never
  color?: string
}

export type IconType = ComponentType<IconProps> | LucideIcon

export type DynamicIconNameType = keyof typeof icons

export interface UserType {
  id: string
  firstName: string
  lastName: string
  name: string
  password: string
  username: string
  role: string
  avatar: string
  background: string
  status: string
  phoneNumber: string
  email: string
  state: string
  country: string
  address: string
  zipCode: string
  language: string
  timeZone: string
  currency: string
  organization: string
  twoFactorAuth: boolean
  loginAlerts: boolean
  accountReoveryOption?: "email" | "sms" | "codes"
  connections: number
  followers: number
}

export interface RouteType {
  type: "guest" | "public" | "protected"
  roles?: string[]
  exceptions?: string[]
}

export interface NotificationType {
  unreadCount: number
  notifications: Array<{
    id: string
    iconName: DynamicIconNameType
    content: string
    url: string
    date: Date
    isRead: boolean
  }>
}

export type FormatStyleType = "percent" | "duration" | "currency" | "regular"

export interface NavigationType {
  title: string
  items: NavigationRootItem[]
}

export type NavigationRootItem =
  | NavigationRootItemWithHrefType
  | NavigationRootItemWithItemsType

export interface NavigationRootItemBasicType {
  title: string
  label?: string
  iconName: DynamicIconNameType
}

export interface NavigationRootItemWithHrefType
  extends NavigationRootItemBasicType {
  href: string
  items?: never
  roles: string[]
}

export interface NavigationRootItemWithItemsType
  extends NavigationRootItemBasicType {
  items: (
    | NavigationNestedItemWithHrefType
    | NavigationNestedItemWithItemsType
  )[]
  href?: never
  roles: string[]
}

export interface NavigationNestedItemBasicType {
  title: string
  label?: string
}

export interface NavigationNestedItemWithHrefType
  extends NavigationNestedItemBasicType {
  href: string
  items?: never
  roles: string[]
}

export interface NavigationNestedItemWithItemsType
  extends NavigationNestedItemBasicType {
  items: (
    | NavigationNestedItemWithHrefType
    | NavigationNestedItemWithItemsType
  )[]
  href?: never
}

export type NavigationNestedItem =
  | NavigationNestedItemWithHrefType
  | NavigationNestedItemWithItemsType

export interface OAuthLinkType {
  href: string
  label: string
  icon: IconType
}

export interface FileType {
  id: string
  name: string
  size: number
  type: string
  url: string
}

export type ForgotPasswordFormType = z.infer<typeof ForgotPasswordSchema>

export type NewPasswordFormType = z.infer<typeof NewPasswordSchema>

export type RegisterFormType = z.infer<typeof RegisterSchema>

export type SignInFormType = z.infer<typeof SignInSchema>

export type VerifyEmailFormType = z.infer<typeof VerifyEmailSchema>

export type ComingSoonFormType = z.infer<typeof ComingSoonSchema>

export type ApiResponse<T> = {
  data: T;
  status: number;
};

export type ApiError = {
  data: any[];
  message: string;
  error: string;
  status: number;
};

export type ErrorResponse = {
  message?: string;
  error?: string;
  details?: {
    message?: string;
  };
};

export interface AdminProfile {
  createdAt: string;   // ISO date string
  email: string;
  isActive: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  locale: string;
  name: string;
  phone: string;
  role: string;
  updatedAt: string;   // ISO date string
  __v: number;
  _id: string;
}

export type ForgotPasswordPayload = {
  email: string
}
export type ResetPasswordPayload = {
  newPassword: string
}

export type InvoiceType = {
  adminId: string
  isVerified: boolean
  isActive: boolean

  // ✅ ADD THESE
  isBlocked: boolean
  isDeleted: boolean
}

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
  unitSize: string
}





