import { useQuery } from "@tanstack/react-query"

import { fetchTickets, fetchTicketById } from "../api/tickets.api"
import { transformTicketsResponse, transformTicket } from "../transformers/tickets.transformers"
import type { Ticket, TicketsData } from "../types/tickets.types"

// ============================================
// QUERY KEYS
// ============================================
export const ticketKeys = {
  all: ["tickets"] as const,
  lists: () => [...ticketKeys.all, "list"] as const,
  list: (page: number, limit: number) => [...ticketKeys.lists(), { page, limit }] as const,
  details: () => [...ticketKeys.all, "detail"] as const,
  detail: (id: string) => [...ticketKeys.details(), id] as const,
}

// ============================================
// HOOKS
// ============================================

/**
 * Fetch paginated tickets list
 * Returns TRANSFORMED data ready for UI
 */
export function useTickets(page: number = 1, limit: number = 10) {
  return useQuery<TicketsData>({
    queryKey: ticketKeys.list(page, limit),
    queryFn: async () => {
      const response = await fetchTickets(page, limit)
      return transformTicketsResponse(response)
    },
  })
}

/**
 * Fetch single ticket by ID
 * Returns TRANSFORMED data ready for UI
 */
export function useTicket(id: string) {
  return useQuery<Ticket>({
    queryKey: ticketKeys.detail(id),
    queryFn: async () => {
      const response = await fetchTicketById(id)
      return transformTicket(response.data)
    },
    enabled: !!id,
  })
}
