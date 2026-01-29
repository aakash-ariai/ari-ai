"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Moon, Sun, Ticket } from "lucide-react"

import { cn } from "@workspace/shared/lib/utils"
import { Button } from "@workspace/shared/components/button"
import { useTheme } from "@workspace/shared/hooks/use-theme"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tickets", href: "/dashboard/tickets", icon: Ticket },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isDark, toggleTheme } = useTheme()

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center justify-between border-b px-6">
        <span className="text-lg font-semibold">Ticketing</span>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
