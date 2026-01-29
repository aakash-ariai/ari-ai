"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@workspace/shared/components/button"
import { useTheme } from "@workspace/shared/hooks/use-theme"

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  )
}
