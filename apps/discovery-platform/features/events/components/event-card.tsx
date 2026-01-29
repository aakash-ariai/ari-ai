"use client"

import { format } from "date-fns"
import { Calendar, MapPin, Users, Video, Ticket } from "lucide-react"

import { Card, CardContent, CardHeader } from "@workspace/shared/components/card"
import { cn } from "@workspace/shared/lib/utils"

import { EventTypeBadge } from "./event-type-badge"
import { EventStatusBadge } from "./event-status-badge"
import type { Event } from "../types/events.types"

interface EventCardProps {
  event: Event
  onClick?: () => void
  className?: string
}

export function EventCard({ event, onClick, className }: EventCardProps) {
  const locationDisplay = event.location.isVirtual
    ? "Virtual Event"
    : `${event.location.city}, ${event.location.country}`

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md hover:border-primary/20 overflow-hidden",
        event.status === "cancelled" && "opacity-60",
        className
      )}
      onClick={onClick}
    >
      {event.coverImage && (
        <div className="h-40 bg-muted">
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <EventTypeBadge type={event.type} />
              <EventStatusBadge status={event.status} />
            </div>
            <h3 className="font-semibold text-lg leading-tight line-clamp-2">{event.title}</h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {event.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>{format(event.startDate, "EEE, MMM d, yyyy • h:mm a")}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            {event.location.isVirtual ? (
              <Video className="h-4 w-4 flex-shrink-0" />
            ) : (
              <MapPin className="h-4 w-4 flex-shrink-0" />
            )}
            <span>{locationDisplay}</span>
          </div>

          {event.attendeesCount > 0 && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4 flex-shrink-0" />
              <span>{event.attendeesCount.toLocaleString()} attending</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-muted-foreground" />
            <span className={cn("font-semibold", event.pricing.isFree && "text-success")}>
              {event.pricing.priceRange}
            </span>
          </div>

          {event.availability.isSoldOut ? (
            <span className="text-sm font-medium text-destructive">Sold Out</span>
          ) : (
            <span className="text-sm text-muted-foreground">
              {event.availability.ticketsAvailable} tickets left
            </span>
          )}
        </div>

        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {event.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
            {event.tags.length > 4 && (
              <span className="px-2 py-0.5 text-xs text-muted-foreground">
                +{event.tags.length - 4} more
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
