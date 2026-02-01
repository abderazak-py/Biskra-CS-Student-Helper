import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    // ✅ Allow preflight requests (CRITICAL)
    if (req.method === "OPTIONS") {
        return NextResponse.next();
    }

    const token = req.cookies.get("token")?.value;
    const { pathname } = req.nextUrl;

    // ✅ Ignore API routes completely
    if (pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    const isLoginRoute = pathname.startsWith("/auth/login");
    const isDashboardRoute = pathname.startsWith("/dashboard");

    if (!token && !isLoginRoute) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (token && isLoginRoute) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (token && !isDashboardRoute && !isLoginRoute) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
