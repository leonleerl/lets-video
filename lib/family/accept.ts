import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { createAdminClient } from "@/lib/supabase/admin";

export async function acceptInvitationToken(
  supabase: SupabaseClient,
  token: string,
): Promise<{ familyId: string } | { error: string }> {
  const { data: familyId, error } = await supabase.rpc(
    "accept_family_invitation",
    { invite_token: token },
  );

  if (error) {
    return { error: error.message };
  }

  if (!familyId || typeof familyId !== "string") {
    return { error: "Could not accept invitation." };
  }

  return { familyId };
}

export function invitationTokenFromUserMetadata(
  metadata: Record<string, unknown> | undefined,
) {
  const token = metadata?.invitation_token;
  return typeof token === "string" && token.length > 0 ? token : null;
}

export type PublicInvitation = {
  token: string;
  email: string;
  role: string;
  status: string;
  expires_at: string;
  family: { id: string; name: string } | null;
};

/** Load invitation by secret token without requiring a logged-in session. */
export async function getInvitationByTokenPublic(
  token: string,
): Promise<PublicInvitation | null> {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("family_invitations")
    .select("token, email, role, status, expires_at, family:families(id, name)")
    .eq("token", token)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const family = Array.isArray(data.family) ? data.family[0] : data.family;

  return {
    token: data.token,
    email: data.email,
    role: data.role,
    status: data.status,
    expires_at: data.expires_at,
    family: family ? { id: family.id, name: family.name } : null,
  };
}

async function findAuthUserIdByEmail(email: string) {
  const admin = createAdminClient();
  const normalized = email.toLowerCase();

  // generateLink works for existing and returns the user object.
  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: normalized,
  });

  if (!error && data.user?.id) {
    return data.user.id;
  }

  // Fallback scan (small projects / local testing).
  for (let page = 1; page <= 5; page += 1) {
    const { data: listed, error: listError } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });

    if (listError) {
      throw new Error(listError.message);
    }

    const match = listed.users.find(
      (user) => user.email?.toLowerCase() === normalized,
    );
    if (match) {
      return match.id;
    }

    if (listed.users.length < 200) {
      break;
    }
  }

  return null;
}

export async function ensureInvitedUserWithPassword(
  email: string,
  password: string,
  metadata: Record<string, string>,
) {
  const admin = createAdminClient();
  const normalized = email.toLowerCase();

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: normalized,
    password,
    email_confirm: true,
    user_metadata: metadata,
  });

  if (!createError && created.user) {
    return created.user;
  }

  const message = createError?.message ?? "";
  const alreadyExists =
    message.toLowerCase().includes("already") ||
    message.toLowerCase().includes("exists") ||
    createError?.status === 422;

  if (!alreadyExists) {
    throw new Error(message || "Could not create account for this invitation.");
  }

  const userId = await findAuthUserIdByEmail(normalized);
  if (!userId) {
    throw new Error("An account exists for this email, but it could not be loaded.");
  }

  const { data: updated, error: updateError } =
    await admin.auth.admin.updateUserById(userId, {
      password,
      email_confirm: true,
      user_metadata: metadata,
    });

  if (updateError || !updated.user) {
    throw new Error(updateError?.message || "Could not update invited account.");
  }

  return updated.user;
}
