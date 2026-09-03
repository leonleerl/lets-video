import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  Family,
  FamilyInvitation,
  FamilyMember,
  FamilyMembership,
  FamilyRole,
} from "@/lib/family/types";

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("You must be signed in.");
  }

  return { supabase, user };
}

export async function listUserFamilies(): Promise<FamilyMembership[]> {
  const { supabase, user } = await requireUser();

  const { data, error } = await supabase
    .from("family_members")
    .select("role, family:families(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? [])
    .map((row) => {
      const family = Array.isArray(row.family) ? row.family[0] : row.family;
      if (!family) {
        return null;
      }

      return {
        role: row.role as FamilyRole,
        family: family as Family,
      };
    })
    .filter((row): row is FamilyMembership => row !== null);
}

export async function getFamilyMembership(
  familyId: string,
): Promise<FamilyMembership | null> {
  const { supabase, user } = await requireUser();

  const { data, error } = await supabase
    .from("family_members")
    .select("role, family:families(*)")
    .eq("family_id", familyId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return null;
  }

  const family = Array.isArray(data.family) ? data.family[0] : data.family;
  if (!family) {
    return null;
  }

  return {
    role: data.role as FamilyRole,
    family: family as Family,
  };
}

export async function listFamilyMembers(
  familyId: string,
): Promise<FamilyMember[]> {
  const { supabase } = await requireUser();

  const { data, error } = await supabase
    .from("family_members")
    .select(
      "id, family_id, user_id, role, created_at, profile:profiles(id, display_name, email)",
    )
    .eq("family_id", familyId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    family_id: row.family_id,
    user_id: row.user_id,
    role: row.role as FamilyRole,
    created_at: row.created_at,
    profile: Array.isArray(row.profile) ? row.profile[0] : row.profile,
  }));
}

export async function listPendingInvitations(
  familyId: string,
): Promise<FamilyInvitation[]> {
  const { supabase } = await requireUser();

  const { data, error } = await supabase
    .from("family_invitations")
    .select("*")
    .eq("family_id", familyId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as FamilyInvitation[];
}

export async function getInvitationByToken(token: string) {
  const { supabase } = await requireUser();

  const { data, error } = await supabase
    .from("family_invitations")
    .select("*, family:families(id, name)")
    .eq("token", token)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function listPendingInvitationsForCurrentUser() {
  const { supabase, user } = await requireUser();

  if (!user.email) {
    return [];
  }

  const { data, error } = await supabase
    .from("family_invitations")
    .select("*, family:families(id, name)")
    .eq("status", "pending")
    .ilike("email", user.email)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
