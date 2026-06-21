import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/admin"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

function copyCookies(source: NextResponse, destination: NextResponse): void {
  source.cookies.getAll().forEach((cookie) => {
    destination.cookies.set(cookie);
  });
}

export async function updateSupabaseSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      }
    }
  });

  const {
    data: { user }
  } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  if (!user && !isPublicPath(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    const redirectResponse = NextResponse.redirect(loginUrl);
    copyCookies(response, redirectResponse);
    return redirectResponse;
  }

  if (user && pathname === "/login") {
    const nextPath = request.nextUrl.searchParams.get("next");
    const destination =
      nextPath?.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/";
    const redirectResponse = NextResponse.redirect(
      new URL(destination, request.url)
    );
    copyCookies(response, redirectResponse);
    return redirectResponse;
  }

  return response;
}
