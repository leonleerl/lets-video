import { notFound } from "next/navigation";

import { InviteMemberForm } from "@/components/family/invite-member-form";
import {
  CancelInvitationButton,
  RemoveMemberButton,
} from "@/components/family/member-actions";
import { Badge } from "@/components/ui/badge";
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

type MembersPageProps = {
  params: Promise<{ familyId: string }>;
};

export default async function MembersPage({ params }: MembersPageProps) {
  const { familyId } = await params;
  const membership = await getFamilyMembership(familyId);

  if (!membership) {
    notFound();
  }

  const manage = canManageFamily(membership.role);
  const [members, invitations] = await Promise.all([
    listFamilyMembers(familyId),
    listPendingInvitations(familyId),
  ]);

  return (
    <>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Members
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage who can access {membership.family.name}.
        </p>
      </div>

      {manage ? (
        <Card>
          <CardHeader>
            <CardTitle>Invite by email</CardTitle>
            <CardDescription>
              New users receive a Supabase invite email. Existing users get an
              accept link you can share.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InviteMemberForm familyId={familyId} />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Current members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3"
            >
                <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {member.profile?.display_name ?? "Family member"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {member.profile?.email ?? member.role}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{member.role}</Badge>
                {manage && member.role !== "owner" ? (
                  <RemoveMemberButton familyId={familyId} memberId={member.id} />
                ) : null}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending invitations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {invitations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending invitations.</p>
          ) : (
            invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {invitation.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Role: {invitation.role} · Expires{" "}
                    {new Date(invitation.expires_at).toLocaleDateString()}
                  </p>
                </div>
                {manage ? (
                  <CancelInvitationButton
                    familyId={familyId}
                    invitationId={invitation.id}
                  />
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </>
  );
}
