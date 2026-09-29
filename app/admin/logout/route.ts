import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side logout handler.
 * Clears the admin_token cookie via Set-Cookie header (reliable, avoids
 * the race condition where client JS removes the cookie but the browser
 * still sends it in the next request before the deletion is committed).
 */
export function GET(request: NextRequest) {
  const loginUrl = new URL("/admin/login", request.url);
  const response = NextResponse.redirect(loginUrl);

  // Delete the cookie server-side so the redirect to /admin/login
  // arrives without the token — middleware will not bounce it back.
  response.cookies.set("admin_token", "", {
    expires: new Date(0),
    path: "/",
    sameSite: "strict",
    httpOnly: false,
  });

  return response;
}
