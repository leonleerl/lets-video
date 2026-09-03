import { redirect } from "next/navigation";

import { AppHeader } from "@/components/app-header";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <AppHeader email={user.email ?? "Signed in"} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-12 sm:px-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Welcome to LetsVideo
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            You are signed in as {user.email}. Family spaces, video upload, and
            private playback come in the next phases. This page confirms that
            authentication is working.
          </p>
        </div>
      </main>
    </>
  );
}
