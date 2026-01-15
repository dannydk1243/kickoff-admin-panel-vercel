import { routeMap } from "@/configs/auth-routes"

const getBasePath = (route: string): string => {
  // Extract the base path (e.g., "/user" from "/user/profile")
  const secondSlash = route.indexOf("/", 1)
  return secondSlash === -1 ? route : route.substring(0, secondSlash)
}

function getBasePathRouteType(route: string) {
  // Remove trailing slash if any
  return route.endsWith("/") && route.length > 1 ? route.slice(0, -1) : route
}

export function canAccessRoute(route: string, role: string): boolean {
  if (!role) return false // no role → deny

  const basePath = getBasePathRouteType(route)
  const routeInfo = routeMap.get(basePath)
  if (!routeInfo) return false

  // For debugging

  // Protected route → check role
  if (routeInfo.type === "protected") {
    // No roles defined → deny
    if (!routeInfo.roles || routeInfo.roles.length === 0) return false

    // Exact match or nested route check
    return routeInfo.roles.includes(role)
  }

  return false
}

function isRouteType(route: string, type: string) {
  const basePath = getBasePath(route)
  const routeInfo = routeMap.get(basePath)

  // Check if route exists and matches the desired type
  if (routeInfo && routeInfo.type === type) {
    // Return false if route matches any exception, otherwise true.
    if (routeInfo.exceptions) {
      return !routeInfo.exceptions.some((exception) =>
        route.startsWith(exception)
      )
    }
    return true
  }

  // If no matching route, return false
  return false
}

export function isPublicRoute(route: string) {
  return isRouteType(route, "public")
}

export function isGuestRoute(route: string) {
  return isRouteType(route, "guest")
}
