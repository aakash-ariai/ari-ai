"use client"

import { AlertCircle, Calendar } from "lucide-react"

import { useEvents } from "../hooks/use-events"
import { EventCard } from "./event-card"
import { EventListSkeleton } from "./event-list-skeleton"

interface EventListProps {
  page?: number
  limit?: number
}

export function EventList({ page = 1, limit = 10 }: EventListProps) {
  const { data, isLoading, error } = useEvents(page, limit)

  if (isLoading) {
    return <EventListSkeleton count={6} />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold">Failed to load events</h3>
        <p className="text-muted-foreground mt-1">
          {error instanceof Error ? error.message : "An unexpected error occurred"}
        </p>
      </div>
    )
  }

  if (!data || data.events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">No events found</h3>
        <p className="text-muted-foreground mt-1">Check back later for upcoming events</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {data.events.length} of {data.total} events
        </span>
        <span>Page {data.page}</span>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {data.hasMore && (
        <p className="text-center text-sm text-muted-foreground">
          More events available. Implement pagination to see more.
        </p>
      )}
    </div>
  )
}
