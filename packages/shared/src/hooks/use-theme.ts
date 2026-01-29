"use client"

import { useCallback, useEffect, useState } from "react"

type Theme = "light" | "dark"

const THEME_KEY = "app-theme"

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light"

  // Check localStorage first
  const stored = localStorage.getItem(THEME_KEY) as Theme | null
  if (stored === "light" || stored === "dark") return stored

  // Fall back to system preference
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark"
  }

  return "light"
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  // Initialize theme on mount
  useEffect(() => {
    setThemeState(getInitialTheme())
    setMounted(true)
  }, [])

  // Apply theme to body
  useEffect(() => {
    if (!mounted) return

    const body = document.body
    if (theme === "dark") {
      body.classList.add("dark")
    } else {
      body.classList.remove("dark")
    }

    localStorage.setItem(THEME_KEY, theme)
  }, [theme, mounted])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"))
  }, [])

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === "dark",
    isLight: theme === "light",
  }
}
