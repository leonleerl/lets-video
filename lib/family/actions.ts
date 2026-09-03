"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  acceptInvitationToken,
  ensureInvitedUserWithPassword,
  getInvitationByTokenPublic,
} from "@/lib/family/accept";
import {
  INVITABLE_ROLES,
  canManageFamily,
  type InvitableRole,
} from "@/lib/family/types";
import { getFamilyMembership, requireUser } from "@/lib/family/queries";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function appOrigin() {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

function isInvitableRole(role: string): role is InvitableRole {
  return (INVITABLE_ROLES as readonly string[]).includes(role);
}

function isAlreadyRegisteredError(message: string) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("already been registered") ||
    normalized.includes("already registered") ||
    normalized.includes("user already exists") ||
    normalized.includes("email_exists")
  );
}

export type ActionResult =
  | {
      ok: true;
      message?: string;
      acceptUrl?: string;
      emailSent?: boolean;
    }
  | { ok: false; error: string };

export async function createFamilyAction(
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    return { ok: false, error: "Enter a family name." };
  }

  try {
    const { supabase } = await requireUser();
    const { data, error } = await supabase.rpc("create_family", {
      family_name: name,
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    const family = Array.isArray(data) ? data[0] : data;
    if (!family?.id) {
      return { ok: false, error: "Family was created but no id was returned." };
    }

    revalidatePath("/home");
    redirect(`/family/${family.id}`);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      String((error as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not create family.",
    };
  }
}

export async function inviteMemberAction(
  familyId: string,
  formData: FormData,
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "member");

  if (!email || !email.includes("@")) {
    return { ok: false, error: "Enter a valid email address." };
  }

  if (!isInvitableRole(role)) {
    return { ok: false, error: "Choose a valid role." };
  }

  try {
    const membership = await getFamilyMembership(familyId);
    if (!membership || !canManageFamily(membership.role)) {
      return {
        ok: false,
        error: "Only family owners and admins can invite members.",
      };
    }

    const { supabase, user } = await requireUser();

    const { data: existingMember, error: memberLookupError } = await supabase
      .from("profiles")
      .select("id, memberships:family_members!inner(id, family_id)")
      .eq("memberships.family_id", familyId)
      .ilike("email", email)
      .maybeSingle();

    if (memberLookupError) {
      return { ok: false, error: memberLookupError.message };
    }

    if (existingMember) {
      return {
        ok: false,
        error: "That person is already a member of this family.",
      };
    }

    const { data: invitation, error: inviteInsertError } = await supabase
      .from("family_invitations")
      .insert({
        family_id: familyId,
        email,
        role,
        invited_by: user.id,
      })
      .select("*")
      .single();

    if (inviteInsertError) {
      if (inviteInsertError.code === "23505") {
        return {
          ok: false,
          error: "A pending invitation already exists for this email.",
        };
      }

      return { ok: false, error: inviteInsertError.message };
    }

    const acceptPath = `/accept-invite/${invitation.token}`;
    const acceptUrl = `${appOrigin()}${acceptPath}`;
    const redirectTo = `${appOrigin()}/auth/callback?next=${encodeURIComponent(acceptPath)}`;
    const inviteMeta = {
      invitation_token: invitation.token,
      family_id: familyId,
    };
    const admin = createAdminClient();

    const { error: inviteEmailError } =
      await admin.auth.admin.inviteUserByEmail(email, {
        redirectTo,
        data: inviteMeta,
      });

    if (!inviteEmailError) {
      revalidatePath(`/family/${familyId}/members`);
      return {
        ok: true,
        emailSent: true,
        message:
          "Invitation email sent. After they open the email and finish login, they should join the family automatically.",
        acceptUrl,
      };
    }

    if (!isAlreadyRegisteredError(inviteEmailError.message)) {
      await supabase
        .from("family_invitations")
        .update({ status: "cancelled", updated_at: new Date().toISOString() })
        .eq("id", invitation.id);

      return { ok: false, error: inviteEmailError.message };
    }

    // User already exists from a previous invite/signup.
    // inviteUserByEmail will not send another invite email — try a magic link instead.
    await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: {
        redirectTo,
        data: inviteMeta,
      },
    });

    const { error: otpError } = await admin.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: redirectTo,
        data: inviteMeta,
      },
    });

    revalidatePath(`/family/${familyId}/members`);

    if (!otpError) {
      return {
        ok: true,
        emailSent: true,
        message:
          "This email already has an account, so Supabase will not send another Invite email. A login/magic-link email was sent instead. They can also use the accept link below.",
        acceptUrl,
      };
    }

    return {
      ok: true,
      emailSent: false,
      message: `No email was sent. This address already has a Supabase account (often from the first invite), and a follow-up email failed (${otpError.message}). Copy the accept link below and share it directly.`,
      acceptUrl,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Could not send invitation.",
    };
  }
}

export async function cancelInvitationAction(
  familyId: string,
  invitationId: string,
): Promise<ActionResult> {
  try {
    const membership = await getFamilyMembership(familyId);
    if (!membership || !canManageFamily(membership.role)) {
      return {
        ok: false,
        error: "Only family owners and admins can cancel invitations.",
      };
    }

    const { supabase } = await requireUser();
    const { error } = await supabase
      .from("family_invitations")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", invitationId)
      .eq("family_id", familyId)
      .eq("status", "pending");

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath(`/family/${familyId}/members`);
    return { ok: true, message: "Invitation cancelled." };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Could not cancel invitation.",
    };
  }
}

export async function removeMemberAction(
  familyId: string,
  memberId: string,
): Promise<ActionResult> {
  try {
    const membership = await getFamilyMembership(familyId);
    if (!membership || !canManageFamily(membership.role)) {
      return {
        ok: false,
        error: "Only family owners and admins can remove members.",
      };
    }

    const { supabase } = await requireUser();
    const { error } = await supabase
      .from("family_members")
      .delete()
      .eq("id", memberId)
      .eq("family_id", familyId);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath(`/family/${familyId}/members`);
    revalidatePath(`/family/${familyId}`);
    return { ok: true, message: "Member removed." };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not remove member.",
    };
  }
}

export async function acceptInvitationAction(
  token: string,
): Promise<ActionResult> {
  try {
    const { supabase } = await requireUser();
    const accepted = await acceptInvitationToken(supabase, token);

    if ("error" in accepted) {
      return { ok: false, error: accepted.error };
    }

    revalidatePath("/home");
    redirect(`/family/${accepted.familyId}`);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      String((error as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Could not accept invitation.",
    };
  }
}

/**
 * First-time invitees (or returning invitees) set/reset a password here,
 * get signed in, then join the family. Does not depend on the email link.
 */
export async function completeInviteAction(
  token: string,
  formData: FormData,
): Promise<ActionResult> {
  const password = String(formData.get("password") ?? "");
  const mode = String(formData.get("mode") ?? "join");

  if (password.length < 6) {
    return { ok: false, error: "Use a password with at least 6 characters." };
  }

  try {
    const invitation = await getInvitationByTokenPublic(token);
    if (!invitation) {
      return { ok: false, error: "Invitation not found." };
    }

    if (invitation.status === "cancelled") {
      return { ok: false, error: "This invitation was cancelled." };
    }

    if (invitation.status === "expired") {
      return { ok: false, error: "This invitation has expired." };
    }

    if (
      invitation.status === "pending" &&
      new Date(invitation.expires_at).getTime() < Date.now()
    ) {
      return { ok: false, error: "This invitation has expired." };
    }

    const supabase = await createClient();

    if (mode === "signin") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: invitation.email,
        password,
      });

      if (signInError) {
        return {
          ok: false,
          error:
            "Sign in failed. If this is your first time, use “Create password & join” instead.",
        };
      }
    } else {
      await ensureInvitedUserWithPassword(invitation.email, password, {
        invitation_token: token,
        family_id: invitation.family?.id ?? "",
      });

      // Replace any existing browser session with the invited account.
      await supabase.auth.signOut();

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: invitation.email,
        password,
      });

      if (signInError) {
        return { ok: false, error: signInError.message };
      }
    }

    if (invitation.status === "accepted" && invitation.family?.id) {
      revalidatePath("/home");
      redirect(`/family/${invitation.family.id}`);
    }

    const accepted = await acceptInvitationToken(supabase, token);
    if ("error" in accepted) {
      return { ok: false, error: accepted.error };
    }

    revalidatePath("/home");
    redirect(`/family/${accepted.familyId}`);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      String((error as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "Could not complete invitation.",
    };
  }
}
