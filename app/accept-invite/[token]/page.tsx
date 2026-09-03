import Link from "next/link";
import { redirect } from "next/navigation";

import { AcceptInviteButton } from "@/components/family/accept-invite-button";
import { JoinInviteForm } from "@/components/family/join-invite-form";
import { AppHeader } from "@/components/app-header";
import { SwitchAccountButton } from "@/components/auth/switch-account-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  acceptInvitationToken,
  getInvitationByTokenPublic,
} from "@/lib/family/accept";
import { listUserFamilies } from "@/lib/family/queries";
import { createClient } from "@/lib/supabase/server";

type AcceptInvitePageProps = {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function AcceptInvitePage({
  params,
  searchParams,
}: AcceptInvitePageProps) {
  const { token } = await params;
  const { error: queryError } = await searchParams;
  const invitation = await getInvitationByTokenPublic(token);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const families = user ? await listUserFamilies() : [];
  const family = invitation?.family ?? null;

  const emailMatches =
    !!invitation &&
    !!user?.email &&
    invitation.email.toLowerCase() === user.email.toLowerCase();

  let loadError = queryError ?? "";

  if (
    user &&
    invitation &&
    family &&
    invitation.status === "pending" &&
    emailMatches &&
    !queryError
  ) {
    const accepted = await acceptInvitationToken(supabase, token);
    if ("familyId" in accepted) {
      redirect(`/family/${accepted.familyId}`);
    }
    loadError = accepted.error;
  }

  if (invitation?.status === "accepted" && family && emailMatches) {
    redirect(`/family/${family.id}`);
  }

  return (
    <>
      {user ? (
        <AppHeader email={user.email ?? "Signed in"} families={families} />
      ) : (
        <header className="border-b border-border">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-4 sm:px-6">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              LetsVideo
            </Link>
          </div>
        </header>
      )}

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Family invitation</CardTitle>
            <CardDescription>
              {invitation?.family
                ? `Join ${invitation.family.name}`
                : "Open your family invitation"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadError ? (
              <p className="text-sm text-destructive">{loadError}</p>
            ) : null}

            {!invitation ? (
              <p className="text-sm text-muted-foreground">
                This invitation was not found. Ask a family admin to send a new
                one.
              </p>
            ) : null}

            {invitation && family ? (
              <>
                <div className="space-y-1 rounded-lg bg-muted/50 px-3 py-3 text-sm">
                  <p>
                    <span className="text-muted-foreground">Family:</span>{" "}
                    <span className="font-medium text-foreground">
                      {family.name}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Invited email:</span>{" "}
                    <span className="font-medium text-foreground">
                      {invitation.email}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Role:</span>{" "}
                    <span className="font-medium text-foreground">
                      {invitation.role}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Status:</span>{" "}
                    <span className="font-medium text-foreground">
                      {invitation.status}
                    </span>
                  </p>
                </div>

                {invitation.status === "pending" && !user ? (
                  <JoinInviteForm token={token} email={invitation.email} />
                ) : null}

                {invitation.status === "pending" && user && emailMatches ? (
                  <AcceptInviteButton token={token} />
                ) : null}

                {invitation.status === "pending" && user && !emailMatches ? (
                  <div className="space-y-3">
                    <p className="text-sm text-destructive">
                      This invitation is for <strong>{invitation.email}</strong>,
                      but you are signed in as <strong>{user.email}</strong>.
                    </p>
                    <SwitchAccountButton
                      nextPath={`/accept-invite/${token}`}
                      emailHint={invitation.email}
                    />
                    <p className="text-xs text-muted-foreground">
                      After signing out, you can create a password for{" "}
                      {invitation.email} on this page.
                    </p>
                  </div>
                ) : null}

                {invitation.status === "accepted" && !emailMatches ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      This invitation was already accepted for{" "}
                      <strong>{invitation.email}</strong>. Sign in with that
                      account to open the family.
                    </p>
                    <SwitchAccountButton
                      nextPath={`/family/${family.id}`}
                      emailHint={invitation.email}
                    />
                  </div>
                ) : null}

                {invitation.status !== "pending" &&
                invitation.status !== "accepted" ? (
                  <p className="text-sm text-muted-foreground">
                    This invitation is {invitation.status}. Ask a family admin
                    for a new invite.
                  </p>
                ) : null}

                <Button variant="outline" asChild>
                  <Link href={user ? "/home" : "/login"}>
                    {user ? "Back to home" : "Sign in"}
                  </Link>
                </Button>
              </>
            ) : null}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
