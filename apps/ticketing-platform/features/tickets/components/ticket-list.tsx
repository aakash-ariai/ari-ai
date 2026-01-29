"use client"

import { AlertCircle, Inbox } from "lucide-react"

import { useTickets } from "../hooks/use-tickets"
import { TicketCard } from "./ticket-card"
import { TicketListSkeleton } from "./ticket-list-skeleton"

interface TicketListProps {
  page?: number
  limit?: number
}

export function TicketList({ page = 1, limit = 10 }: TicketListProps) {
  const { data, isLoading, error } = useTickets(page, limit)

  if (isLoading) {
    return <TicketListSkeleton count={5} />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold">Failed to load tickets</h3>
        <p className="text-muted-foreground mt-1">
          {error instanceof Error ? error.message : "An unexpected error occurred"}
        </p>
      </div>
    )
  }

  if (!data || data.tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">No tickets found</h3>
        <p className="text-muted-foreground mt-1">Create a new ticket to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {data.tickets.length} of {data.total} tickets
        </span>
        <span>Page {data.page}</span>
      </div>

      <div className="grid gap-4">
        {data.tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>

      {data.hasMore && (
        <p className="text-center text-sm text-muted-foreground">
          More tickets available. Implement pagination to see more.
        </p>
      )}
    </div>
  )
}
