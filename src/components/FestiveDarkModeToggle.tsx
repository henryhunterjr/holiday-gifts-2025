import { useTheme } from "next-themes";
import { Moon, Sun, Snowflake, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FestiveDarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-24 h-12 rounded-full bg-muted/50 animate-pulse" />
    );
  }

  const isDark = theme === "dark";

  return (
    <div className="relative">
      {/* Festive Toggle Button */}
      <Button
        variant="outline"
        size="lg"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={cn(
          "relative overflow-hidden rounded-full px-6 py-6 transition-all duration-500 border-2",
          "hover:scale-105 hover:shadow-lg",
          isDark
            ? "bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 border-purple-400/30 text-white hover:border-purple-400/50"
            : "bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 border-amber-300/50 text-amber-900 hover:border-amber-400"
        )}
      >
        <div className="flex items-center gap-3">
          {/* Icon Container with Animation */}
          <div className="relative w-6 h-6">
            {/* Sun Icon (Light Mode) */}
            <Sun
              className={cn(
                "absolute inset-0 transition-all duration-500",
                isDark
                  ? "opacity-0 rotate-180 scale-0"
                  : "opacity-100 rotate-0 scale-100"
              )}
              size={24}
            />
            {/* Moon Icon (Dark Mode) */}
            <Moon
              className={cn(
                "absolute inset-0 transition-all duration-500",
                isDark
                  ? "opacity-100 rotate-0 scale-100"
                  : "opacity-0 -rotate-180 scale-0"
              )}
              size={24}
            />
          </div>

          {/* Text Label */}
          <span className="font-medium text-sm whitespace-nowrap">
            {isDark ? "Night" : "Day"} Mode
          </span>

          {/* Decorative Icon */}
          <div className="relative w-5 h-5">
            <Sparkles
              className={cn(
                "absolute inset-0 transition-all duration-500",
                isDark
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-0"
              )}
              size={20}
            />
            <Snowflake
              className={cn(
                "absolute inset-0 transition-all duration-500 animate-spin",
                "[animation-duration:_10s]",
                !isDark
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-0"
              )}
              size={20}
            />
          </div>
        </div>

        {/* Festive Sparkle Effects */}
        {!isDark && (
          <>
            <div className="absolute top-1 right-3 w-1 h-1 bg-amber-400 rounded-full animate-ping" />
            <div className="absolute top-3 left-4 w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse" />
            <div className="absolute bottom-2 right-6 w-1 h-1 bg-amber-300 rounded-full animate-ping [animation-delay:_0.5s]" />
          </>
        )}

        {/* Night Sky Stars */}
        {isDark && (
          <>
            <div className="absolute top-2 left-4 w-1 h-1 bg-purple-300 rounded-full animate-pulse" />
            <div className="absolute top-3 right-5 w-1.5 h-1.5 bg-blue-300 rounded-full animate-ping [animation-delay:_0.3s]" />
            <div className="absolute bottom-3 left-8 w-1 h-1 bg-indigo-300 rounded-full animate-pulse [animation-delay:_0.7s]" />
          </>
        )}
      </Button>

      {/* Glow Effect */}
      <div
        className={cn(
          "absolute inset-0 -z-10 rounded-full blur-xl transition-opacity duration-500",
          isDark
            ? "bg-purple-500/20 opacity-50"
            : "bg-amber-400/30 opacity-40"
        )}
      />
    </div>
  );
}
