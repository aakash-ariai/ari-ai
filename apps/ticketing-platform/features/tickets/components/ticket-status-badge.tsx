"use client"

import { Badge } from "@workspace/shared/components/badge"
import { cn } from "@workspace/shared/lib/utils"
import type { TicketStatus } from "../types/tickets.types"

interface TicketStatusBadgeProps {
  status: TicketStatus
  className?: string
}

const statusConfig: Record<TicketStatus, { label: string; className: string }> = {
  open: {
    label: "Open",
    className: "bg-info/10 text-info border-info/20 hover:bg-info/20",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20",
  },
  resolved: {
    label: "Resolved",
    className: "bg-success/10 text-success border-success/20 hover:bg-success/20",
  },
  closed: {
    label: "Closed",
    className: "bg-muted text-muted-foreground border-muted hover:bg-muted",
  },
}

export function TicketStatusBadge({ status, className }: TicketStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
