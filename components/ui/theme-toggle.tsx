"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    console.log('ThemeToggle mounted!')
    setMounted(true)
  }, [])

  // Debug: Log theme changes
  React.useEffect(() => {
    if (mounted) {
      console.log('Theme state changed - Current:', theme, 'Resolved:', resolvedTheme)
    }
  }, [theme, resolvedTheme, mounted])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
      >
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  const handleClick = () => {
    console.log('Toggle clicked! Current theme:', theme)
    const newTheme = theme === "dark" ? "light" : "dark"
    console.log('Setting theme to:', newTheme)
    setTheme(newTheme)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className="h-8 w-8 p-0"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  )
}
