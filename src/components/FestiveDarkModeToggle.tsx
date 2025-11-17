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
    <div className="relative group">
      {/* Festive Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={cn(
          "relative overflow-hidden rounded-full transition-all duration-500 border-2",
          "group-hover:scale-110 hover:shadow-lg",
          "px-3 py-2 group-hover:px-6 group-hover:py-3",
          isDark
            ? "bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 border-purple-400/30 text-white hover:border-purple-400/50"
            : "bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 border-amber-300/50 text-amber-900 hover:border-amber-400"
        )}
      >
        <div className="flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
          {/* Icon Container with Animation */}
          <div className="relative w-5 h-5 group-hover:w-6 group-hover:h-6 transition-all duration-300">
            {/* Sun Icon (Light Mode) */}
            <Sun
              className={cn(
                "absolute inset-0 transition-all duration-500",
                isDark
                  ? "opacity-0 rotate-180 scale-0"
                  : "opacity-100 rotate-0 scale-100"
              )}
            />
            {/* Moon Icon (Dark Mode) */}
            <Moon
              className={cn(
                "absolute inset-0 transition-all duration-500",
                isDark
                  ? "opacity-100 rotate-0 scale-100"
                  : "opacity-0 -rotate-180 scale-0"
              )}
            />
          </div>

          {/* Text Label - Hidden by default, shown on hover */}
          <span className="font-medium text-xs overflow-hidden max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 whitespace-nowrap transition-all duration-500">
            {isDark ? "Night" : "Day"} Mode
          </span>

          {/* Decorative Icon */}
          <div className="relative w-4 h-4 group-hover:w-5 group-hover:h-5 transition-all duration-300">
            <Sparkles
              className={cn(
                "absolute inset-0 transition-all duration-500",
                isDark
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-0"
              )}
            />
            <Snowflake
              className={cn(
                "absolute inset-0 transition-all duration-500 animate-spin",
                "[animation-duration:_10s]",
                !isDark
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-0"
              )}
            />
          </div>
        </div>

        {/* Festive Sparkle Effects - Only visible on hover */}
        {!isDark && (
          <>
            <div className="absolute top-1 right-3 w-1 h-1 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity" />
            <div className="absolute top-3 left-4 w-1.5 h-1.5 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
            <div className="absolute bottom-2 right-6 w-1 h-1 bg-amber-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping [animation-delay:_0.5s] transition-opacity" />
          </>
        )}

        {/* Night Sky Stars - Only visible on hover */}
        {isDark && (
          <>
            <div className="absolute top-2 left-4 w-1 h-1 bg-purple-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
            <div className="absolute top-3 right-5 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping [animation-delay:_0.3s] transition-opacity" />
            <div className="absolute bottom-3 left-8 w-1 h-1 bg-indigo-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse [animation-delay:_0.7s] transition-opacity" />
          </>
        )}
      </Button>

      {/* Glow Effect - Only visible on hover */}
      <div
        className={cn(
          "absolute inset-0 -z-10 rounded-full blur-xl transition-all duration-500",
          "opacity-0 group-hover:opacity-50",
          isDark
            ? "bg-purple-500/20"
            : "bg-amber-400/30"
        )}
      />
    </div>
  );
}
