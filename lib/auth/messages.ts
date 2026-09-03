export function authErrorMessage(error: { message: string; code?: string } | null) {
  if (!error) {
    return "Sign in failed. Check your email and password, then try again.";
  }

  const code = error.code ?? "";
  const message = error.message.toLowerCase();

  if (code === "invalid_credentials" || message.includes("invalid login credentials")) {
    return "That email or password is incorrect.";
  }

  if (code === "email_not_confirmed" || message.includes("email not confirmed")) {
    return "Confirm your email before signing in. Check your inbox for the link from Supabase.";
  }

  if (code === "user_already_exists" || message.includes("already registered")) {
    return "An account with this email already exists. Sign in instead.";
  }

  if (code === "weak_password" || message.includes("password")) {
    return "Use a password with at least 6 characters.";
  }

  if (message.includes("invalid") && message.includes("email")) {
    return "Enter a valid email address.";
  }

  if (message.includes("rate limit") || message.includes("too many")) {
    return "Too many attempts. Wait a moment and try again.";
  }

  return error.message;
}
