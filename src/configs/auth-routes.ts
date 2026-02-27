import { ROLES } from "@/lib/enum"
import type { RouteType } from "@/types"

export const routeMap = new Map<string, RouteType>([
  ["/sign-in", { type: "guest" }],
  ["/register", { type: "guest" }],
  ["/forgot-password", { type: "guest" }],
  ["/auth-admin-activate", { type: "guest" }],
  ["/auth-reset-password", { type: "guest" }],
  
  // ["/docs", { type: "public" }],

  // PROTECTED ROUTES WITH ROLES
  
  ["/pages/users", { type: "protected", roles: [ROLES.ADMIN, ROLES.SUPERADMIN] }],
  ["/pages/admins", { type: "protected", roles: [ROLES.SUPERADMIN] }],
  ["/pages/court-owners", { type: "protected", roles: [ROLES.ADMIN, ROLES.SUPERADMIN] }],
  ["/pages/courts", { type: "protected", roles: [ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.OWNER] }],
  ["/pages/bookings", { type: "protected", roles: [ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.OWNER] }],
  ["/pages/trainings", { type: "protected", roles: [ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.OWNER] }],
  ["/pages/user-wallet", { type: "protected", roles: [ROLES.ADMIN, ROLES.SUPERADMIN] }],
  ["/pages/refunds", { type: "protected", roles: [ROLES.ADMIN, ROLES.SUPERADMIN] }],
  ["/pages/reports", { type: "protected", roles: [ROLES.ADMIN, ROLES.SUPERADMIN] }],
  ["/pages/announcement", { type: "protected", roles: [ROLES.SUPERADMIN] }],
  ["/pages/setting", { type: "protected", roles: [ROLES.ADMIN, ROLES.SUPERADMIN] }],

  ["/pages/account/settings", { type: "protected", roles: [ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.OWNER] }],
  ["/pages/account/settings/security", { type: "protected", roles: [ROLES.ADMIN, ROLES.SUPERADMIN, ROLES.OWNER] }],

])

export function checkIfRouteExists(pathname: string): boolean {
  const routes = [
    "/pages/users", 
    "/pages/admins", 
    "/pages/court-owners", 
    "/pages/courts",
    "/pages/bookings",
    "/pages/trainings",
    "/pages/user-wallet",
    "/pages/refunds",
    "/pages/reports",
    "/pages/announcement",
    "/pages/setting",
    "/pages/account/settings",
    "/pages/account/settings/security",
    "/pages/unauthorized-401",
    "/pages/not-found-404"
  ];

  return routes.includes(pathname);
}