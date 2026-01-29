"use client"

import { formatDistanceToNow } from "date-fns"
import { Clock, User } from "lucide-react"

import { Card, CardContent, CardHeader } from "@workspace/shared/components/card"
import { Avatar, AvatarFallback } from "@workspace/shared/components/avatar"
import { cn } from "@workspace/shared/lib/utils"

import { TicketStatusBadge } from "./ticket-status-badge"
import { TicketPriorityBadge } from "./ticket-priority-badge"
import type { Ticket } from "../types/tickets.types"

interface TicketCardProps {
  ticket: Ticket
  onClick?: () => void
  className?: string
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function TicketCard({ ticket, onClick, className }: TicketCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md hover:border-primary/20",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base leading-tight truncate">{ticket.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">#{ticket.id}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <TicketPriorityBadge priority={ticket.priority} />
            <TicketStatusBadge status={ticket.status} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {ticket.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{ticket.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatDistanceToNow(ticket.createdAt, { addSuffix: true })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span>{ticket.reporter.name}</span>
            </div>
          </div>

          {ticket.assignee ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {getInitials(ticket.assignee.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{ticket.assignee.name}</span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground italic">Unassigned</span>
          )}
        </div>

        {ticket.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {ticket.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
