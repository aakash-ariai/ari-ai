"use client"

import { Badge } from "@workspace/shared/components/badge"
import { cn } from "@workspace/shared/lib/utils"
import type { EventType } from "../types/events.types"

interface EventTypeBadgeProps {
  type: EventType
  className?: string
}

const typeConfig: Record<EventType, { label: string; className: string }> = {
  conference: {
    label: "Conference",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  workshop: {
    label: "Workshop",
    className: "bg-info/10 text-info border-info/20",
  },
  meetup: {
    label: "Meetup",
    className: "bg-success/10 text-success border-success/20",
  },
  webinar: {
    label: "Webinar",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  concert: {
    label: "Concert",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  exhibition: {
    label: "Exhibition",
    className: "bg-secondary text-secondary-foreground border-secondary",
  },
}

export function EventTypeBadge({ type, className }: EventTypeBadgeProps) {
  const config = typeConfig[type]

  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
