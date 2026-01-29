"use client"

import { Badge } from "@workspace/shared/components/badge"
import { cn } from "@workspace/shared/lib/utils"
import type { TicketPriority } from "../types/tickets.types"

interface TicketPriorityBadgeProps {
  priority: TicketPriority
  className?: string
}

const priorityConfig: Record<TicketPriority, { label: string; className: string }> = {
  critical: {
    label: "Critical",
    className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  },
  urgent: {
    label: "Urgent",
    className: "bg-destructive/80 text-destructive-foreground hover:bg-destructive/70",
  },
  high: {
    label: "High",
    className: "bg-warning text-warning-foreground hover:bg-warning/90",
  },
  medium: {
    label: "Medium",
    className: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  },
  low: {
    label: "Low",
    className: "bg-muted text-muted-foreground hover:bg-muted/80",
  },
}

export function TicketPriorityBadge({ priority, className }: TicketPriorityBadgeProps) {
  const config = priorityConfig[priority]

  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
