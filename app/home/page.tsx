import Link from "next/link";
import { redirect } from "next/navigation";

import { AppHeader } from "@/components/app-header";
import { CreateFamilyForm } from "@/components/family/create-family-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  listPendingInvitationsForCurrentUser,
  listUserFamilies,
} from "@/lib/family/queries";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [families, pendingInvites] = await Promise.all([
    listUserFamilies(),
    listPendingInvitationsForCurrentUser(),
  ]);

  return (
    <>
      <AppHeader email={user.email ?? "Signed in"} families={families} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-12 sm:px-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Your family spaces
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Create a private family space or open one you already belong to.
            Video upload and playback arrive in later phases.
          </p>
        </div>

        {pendingInvites.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Pending invitations for you</CardTitle>
              <CardDescription>
                Open an invitation to join the family. Confirming the email alone
                does not add you as a member.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingInvites.map((invitation) => {
                const family = Array.isArray(invitation.family)
                  ? invitation.family[0]
                  : invitation.family;

                return (
                  <Link
                    key={invitation.id}
                    href={`/accept-invite/${invitation.token}`}
                    className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {family?.name ?? "Family invitation"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Role: {invitation.role}
                      </p>
                    </div>
                    <span className="text-sm text-primary">Accept</span>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Families</CardTitle>
              <CardDescription>
                {families.length === 0
                  ? "You are not in a family yet."
                  : `You belong to ${families.length} family space${families.length === 1 ? "" : "s"}.`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {families.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Create your first family space to invite relatives.
                </p>
              ) : (
                families.map((membership) => (
                  <Link
                    key={membership.family.id}
                    href={`/family/${membership.family.id}`}
                    className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {membership.family.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Your role: {membership.role}
                      </p>
                    </div>
                    <span className="text-sm text-primary">Open</span>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create a family</CardTitle>
              <CardDescription>
                You become the owner and can invite members by email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateFamilyForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
