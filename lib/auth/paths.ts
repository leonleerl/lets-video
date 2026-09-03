export function safeNextPath(next: string | undefined, fallback = "/home") {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return fallback;
  }

  return next;
}
