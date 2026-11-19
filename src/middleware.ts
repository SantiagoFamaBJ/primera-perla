import { NextResponse, type NextRequest } from "next/server";

// /admin (y cualquier variante de mayúsculas) → /ADMIN, comparando exacto para no entrar en bucle
export function middleware(req: NextRequest) {
  const p = req.nextUrl.pathname.replace(/\/$/, "");
  if (p.toLowerCase() === "/admin" && p !== "/ADMIN") {
    const url = req.nextUrl.clone();
    url.pathname = "/ADMIN";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin", "/Admin", "/ADMIN", "/admin/", "/ADMIN/"] };
