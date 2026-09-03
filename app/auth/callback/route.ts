import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

import { safeNextPath } from "@/lib/auth/paths";
import {
  acceptInvitationToken,
  invitationTokenFromUserMetadata,
} from "@/lib/family/accept";
import { createClient } from "@/lib/supabase/server";

function inviteTokenFromNextPath(next: string) {
  const match = next.match(/^\/accept-invite\/([^/?#]+)/);
  return match?.[1] ?? null;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNextPath(searchParams.get("next") ?? undefined);
  const pathToken = inviteTokenFromNextPath(next);

  const supabase = await createClient();

  // Email links must replace any existing browser session.
  await supabase.auth.signOut();

  let authError: string | null = null;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    authError = error?.message ?? null;
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    authError = error?.message ?? null;
  } else {
    authError = "missing_auth_params";
  }

  if (authError) {
    // Prefer the accept-invite page so first-time invitees can set a password
    // instead of seeing a dead login error.
    if (pathToken) {
      return NextResponse.redirect(
        `${origin}/accept-invite/${pathToken}?error=${encodeURIComponent(
          "The email link expired or was already used. Create a password below to join the family.",
        )}`,
      );
    }

    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (pathToken) {
      return NextResponse.redirect(`${origin}/accept-invite/${pathToken}`);
    }
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
  }

  const metadataToken = invitationTokenFromUserMetadata(
    user.user_metadata as Record<string, unknown> | undefined,
  );
  const inviteToken = metadataToken ?? pathToken;

  if (inviteToken) {
    const { data: invitation } = await supabase
      .from("family_invitations")
      .select("email, status")
      .eq("token", inviteToken)
      .maybeSingle();

    if (
      invitation?.email &&
      user.email &&
      invitation.email.toLowerCase() !== user.email.toLowerCase()
    ) {
      await supabase.auth.signOut();
      return NextResponse.redirect(
        `${origin}/accept-invite/${inviteToken}?error=${encodeURIComponent(
          `This invite is for ${invitation.email}. Sign out of other accounts, then create a password or sign in with that email.`,
        )}`,
      );
    }

    const accepted = await acceptInvitationToken(supabase, inviteToken);
    if ("familyId" in accepted) {
      return NextResponse.redirect(`${origin}/family/${accepted.familyId}`);
    }

    return NextResponse.redirect(
      `${origin}/accept-invite/${inviteToken}?error=${encodeURIComponent(accepted.error)}`,
    );
  }

  return NextResponse.redirect(`${origin}${next}`);
}
