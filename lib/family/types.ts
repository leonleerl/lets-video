export const FAMILY_ROLES = ["owner", "admin", "member", "viewer"] as const;
export type FamilyRole = (typeof FAMILY_ROLES)[number];

export const INVITABLE_ROLES = ["admin", "member", "viewer"] as const;
export type InvitableRole = (typeof INVITABLE_ROLES)[number];

export const INVITATION_STATUSES = [
  "pending",
  "accepted",
  "expired",
  "cancelled",
] as const;
export type InvitationStatus = (typeof INVITATION_STATUSES)[number];

export type Profile = {
  id: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Family = {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
};

export type FamilyMember = {
  id: string;
  family_id: string;
  user_id: string;
  role: FamilyRole;
  created_at: string;
  profile?: Pick<Profile, "id" | "display_name" | "email"> | null;
};

export type FamilyInvitation = {
  id: string;
  family_id: string;
  email: string;
  role: InvitableRole;
  invited_by: string;
  token: string;
  status: InvitationStatus;
  expires_at: string;
  created_at: string;
  updated_at: string;
};

export type FamilyMembership = {
  role: FamilyRole;
  family: Family;
};

export function canManageFamily(role: FamilyRole | null | undefined) {
  return role === "owner" || role === "admin";
}
