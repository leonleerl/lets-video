import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getPublicEnv, getSecretEnv } from "@/lib/env";

export function createAdminClient() {
  const publicEnv = getPublicEnv();
  const secretEnv = getSecretEnv();

  return createClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    secretEnv.SUPABASE_SECRET_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
