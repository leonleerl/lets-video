import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required"),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

function missingEnvMessage(issues: z.ZodIssue[]): string {
  const fields = issues
    .map((issue) => issue.path.join("."))
    .filter(Boolean)
    .join(", ");

  return [
    `Missing or invalid environment variables${fields ? `: ${fields}` : "."}`,
    "Copy .env.example to .env.local and add your Supabase project URL and publishable key.",
    "See docs/supabase-setup.md.",
  ].join(" ");
}

export function getPublicEnv(): PublicEnv {
  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });

  if (!parsed.success) {
    throw new Error(missingEnvMessage(parsed.error.issues));
  }

  return parsed.data;
}
