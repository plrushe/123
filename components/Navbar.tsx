import Link from "next/link";
import { signOutAction } from "@/app/auth/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MainNavLinks } from "@/components/MainNavLinks";


export async function Navbar() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = user?.user_metadata?.role;
  const dashboardHref = role === "recruiter" ? "/recruiter" : "/candidate";

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="text-xl font-bold tracking-tight text-slate-900">TeachBoard</div>
        <MainNavLinks />

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href={dashboardHref} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                Dashboard
              </Link>
              <form action={signOutAction}>
                <button className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                Sign in
              </Link>
              <Link href="/signup" className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
