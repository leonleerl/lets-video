import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getFamilyMembership,
  listFamilyMembers,
  listPendingInvitations,
} from "@/lib/family/queries";
import { canManageFamily } from "@/lib/family/types";

type FamilyPageProps = {
  params: Promise<{ familyId: string }>;
};

export default async function FamilyPage({ params }: FamilyPageProps) {
  const { familyId } = await params;
  const membership = await getFamilyMembership(familyId);

  if (!membership) {
    notFound();
  }

  const [members, invitations] = await Promise.all([
    listFamilyMembers(familyId),
    listPendingInvitations(familyId),
  ]);

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {membership.family.name}
            </h1>
            <Badge variant="secondary">{membership.role}</Badge>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            This is your family dashboard. Members and invitations are ready now.
            Videos, albums, and private playback come next.
          </p>
        </div>
        {canManageFamily(membership.role) ? (
          <Button asChild>
            <Link href={`/family/${familyId}/members`}>Invite members</Link>
          </Button>
        ) : null}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>
              {members.length} member{members.length === 1 ? "" : "s"} in this
              family.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {members.slice(0, 5).map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
              >
                <span className="text-sm text-foreground">
                  {member.profile?.display_name ?? "Family member"}
                </span>
                <span className="text-xs text-muted-foreground">{member.role}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending invitations</CardTitle>
            <CardDescription>
              {invitations.length} waiting to be accepted.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {invitations.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No pending invitations.
              </p>
            ) : (
              invitations.slice(0, 5).map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
                >
                  <span className="truncate text-sm text-foreground">
                    {invitation.email}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {invitation.role}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
