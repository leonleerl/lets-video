import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { AppHeader } from "@/components/app-header";
import {
  getFamilyMembership,
  listUserFamilies,
} from "@/lib/family/queries";
import { createClient } from "@/lib/supabase/server";

type FamilyLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ familyId: string }>;
};

export default async function FamilyLayout({
  children,
  params,
}: FamilyLayoutProps) {
  const { familyId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const membership = await getFamilyMembership(familyId);
  if (!membership) {
    notFound();
  }

  const families = await listUserFamilies();

  return (
    <>
      <AppHeader
        email={user.email ?? "Signed in"}
        families={families}
        currentFamilyId={familyId}
      />
      <div className="border-b border-border bg-secondary/30">
        <div className="mx-auto flex w-full max-w-6xl gap-6 px-4 py-3 text-sm sm:px-6">
          <Link
            href={`/family/${familyId}`}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Overview
          </Link>
          <Link
            href={`/family/${familyId}/members`}
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Members
          </Link>
          <Link
            href="/home"
            className="ml-auto text-muted-foreground transition-colors hover:text-foreground"
          >
            All families
          </Link>
        </div>
      </div>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-10 sm:px-6">
        {children}
      </main>
    </>
  );
}
