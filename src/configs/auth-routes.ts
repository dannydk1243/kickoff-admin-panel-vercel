import { ROLES } from "@/lib/enum"
import type { RouteType } from "@/types"

export const routeMap = new Map<string, RouteType>([
  ["/sign-in", { type: "guest" }],
  ["/register", { type: "guest" }],
  ["/forgot-password", { type: "guest" }],
  ["/auth-admin-activate", { type: "guest" }],
  ["/auth-reset-password", { type: "guest" }],
  ["/pages/maintenance", {type: "protected", roles: [ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.OWNER]}],
  ["/", { type: "public" }],
  // ["/docs", { type: "public" }],

  // PROTECTED ROUTES WITH ROLES
  ["/", { type: "protected", roles: [ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.OWNER] }],
  ["/pages/users", { type: "protected", roles: [ROLES.ADMIN, ROLES.SUPERADMIN] }],
  ["/pages/admins", { type: "protected", roles: [ROLES.SUPERADMIN] }],
  ["/pages/court-owners", { type: "protected", roles: [ROLES.ADMIN, ROLES.SUPERADMIN] }],
  ["/pages/courts", { type: "protected", roles: [ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.OWNER] }],
  ["/pages/all-bookings", { type: "protected", roles: [ROLES.ADMIN, ROLES.SUPERADMIN] }],
  ["/pages/all-trainings", { type: "protected", roles: [ROLES.ADMIN, ROLES.SUPERADMIN] }],
  ["/pages/reports", { type: "protected", roles: [ROLES.ADMIN, ROLES.SUPERADMIN] }],
  ["/pages/announcement", { type: "protected", roles: [ROLES.SUPERADMIN] }],
  ["/pages/setting", { type: "protected", roles: [ROLES.ADMIN, ROLES.SUPERADMIN] }],

  ["/pages/account/settings", { type: "protected", roles: [ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.OWNER] }],
  ["/pages/account/settings/security", { type: "protected", roles: [ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.OWNER] }],

])
