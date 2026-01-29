"use client"

import { Badge } from "@workspace/shared/components/badge"
import { cn } from "@workspace/shared/lib/utils"
import type { EventStatus } from "../types/events.types"

interface EventStatusBadgeProps {
  status: EventStatus
  className?: string
}

const statusConfig: Record<EventStatus, { label: string; className: string }> = {
  upcoming: {
    label: "Upcoming",
    className: "bg-info text-info-foreground",
  },
  live: {
    label: "Live Now",
    className: "bg-success text-success-foreground animate-pulse",
  },
  ended: {
    label: "Ended",
    className: "bg-muted text-muted-foreground",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-destructive text-destructive-foreground",
  },
}

export function EventStatusBadge({ status, className }: EventStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
