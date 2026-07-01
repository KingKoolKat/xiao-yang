import { redirect } from "next/navigation";
import { LoginForm } from "@/app/login/LoginForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface LoginPageProps {
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
}

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

  return <LoginForm error={params?.error} nextPath={nextPath} />;
}
