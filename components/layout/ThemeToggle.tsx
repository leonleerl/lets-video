"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "lucide-react";

const emptySubscribe = () => () => {};

function useHasMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

function ThemeToggle() {
  const mounted = useHasMounted();
  const { theme, setTheme } = useTheme();

  if (!mounted) return null;

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <SunIcon className="size-4" />
      ) : (
        <MoonIcon className="size-4" />
      )}
    </button>
  );
}

export { ThemeToggle };
