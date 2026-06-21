import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { AdminLessonBuilder } from "@/app/admin/AdminLessonBuilder";
import {
  ADMIN_COOKIE_NAME,
  DEFAULT_DEV_PASSWORD,
  createAdminSessionValue,
  isAdminAuthenticated,
  verifyAdminPassword
} from "@/lib/adminAuth";

interface AdminPageProps {
  searchParams?: Promise<{
    error?: string;
  }>;
}

async function loginAction(formData: FormData) {
  "use server";

  const password = String(formData.get("password") ?? "");

  if (!verifyAdminPassword(password)) {
    redirect("/admin?error=1");
  }

  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE_NAME, createAdminSessionValue(), {
    httpOnly: true,
    maxAge: 60 * 60 * 12,
    path: "/admin",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });

  redirect("/admin");
}

async function logoutAction() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect("/admin");
}

function AdminLogin({ hasError }: { hasError: boolean }) {
  const usingDefaultPassword = !process.env.ADMIN_PASSWORD;

  return (
    <AppShell
      title="Admin Login"
      subtitle="Lesson builder access"
      showLogout={false}
    >
      <section className="mx-auto max-w-md rounded-2xl border border-garden-pond bg-garden-ivory p-5 shadow-soft">
        <form action={loginAction} className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-bold text-garden-cocoa">Password</span>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-2xl border border-garden-cream bg-white px-4 py-3 outline-none focus:border-garden-moss"
            />
          </label>

          {hasError ? (
            <p className="rounded-xl border border-garden-blossom bg-garden-petal p-3 text-sm font-bold text-garden-clay">
              Wrong password.
            </p>
          ) : null}

          {usingDefaultPassword ? (
            <p className="rounded-xl border border-garden-seed bg-garden-mist p-3 text-sm text-garden-taupe">
              Local default password: {DEFAULT_DEV_PASSWORD}. Set ADMIN_PASSWORD to change it.
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-2xl bg-garden-clay px-5 py-3 font-bold text-white"
          >
            Enter admin
          </button>
        </form>
      </section>
    </AppShell>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const [isAuthed, params] = await Promise.all([
    isAdminAuthenticated(),
    searchParams
  ]);

  if (!isAuthed) {
    return <AdminLogin hasError={params?.error === "1"} />;
  }

  return <AdminLessonBuilder logoutAction={logoutAction} />;
}
