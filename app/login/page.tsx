import { redirect } from "next/navigation";
import { loginAction } from "@/app/auth/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface LoginPageProps {
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
}

const errorMessages: Record<string, string> = {
  invalid: "That email or password did not work.",
  missing: "Enter both an email and password.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  const nextPath =
    params?.next?.startsWith("/") && !params.next.startsWith("//")
      ? params.next
      : "/";

  return (
    <main className="flex min-h-screen items-center justify-center bg-garden-dew p-4 text-garden-cocoa">
      <section className="w-full max-w-md border-4 border-garden-cocoa bg-garden-ivory p-5 shadow-[8px_8px_0_#4A342A]">
        <p className="font-mono text-xs font-black uppercase text-garden-moss">
          Xiao Yang Learns Chinese
        </p>
        <h1 className="mt-1 font-hand text-4xl leading-tight text-garden-cocoa">
          Welcome back
        </h1>
        <p className="mt-2 text-sm font-bold leading-6 text-garden-taupe">
          Sign in to continue your lessons and keep your progress in sync.
        </p>

        <form action={loginAction} className="mt-6 space-y-4">
          <input type="hidden" name="next" value={nextPath} />
          <label className="block space-y-2">
            <span className="font-mono text-xs font-black uppercase text-garden-moss">
              Email
            </span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full border-4 border-garden-cocoa bg-white px-3 py-3 font-bold outline-none focus:bg-garden-mist"
            />
          </label>
          <label className="block space-y-2">
            <span className="font-mono text-xs font-black uppercase text-garden-moss">
              Password
            </span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full border-4 border-garden-cocoa bg-white px-3 py-3 font-bold outline-none focus:bg-garden-mist"
            />
          </label>

          {params?.error ? (
            <p className="border-4 border-garden-cocoa bg-garden-petal p-3 text-sm font-bold text-garden-clay">
              {errorMessages[params.error] ?? "Sign in failed. Please try again."}
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full border-4 border-garden-cocoa bg-garden-clay px-4 py-3 font-mono text-sm font-black uppercase text-white shadow-[4px_4px_0_#4A342A]"
          >
            Enter lessons
          </button>
        </form>
      </section>
    </main>
  );
}
