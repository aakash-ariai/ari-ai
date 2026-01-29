import type {
  ApiTicket,
  ApiTicketsResponse,
  Ticket,
  TicketsData,
  TicketPriority,
} from "../types/tickets.types"

// ============================================
// PRIORITY MAPPING
// ============================================
const PRIORITY_MAP: Record<number, TicketPriority> = {
  1: "critical",
  2: "urgent",
  3: "high",
  4: "medium",
  5: "low",
}

// ============================================
// TRANSFORMERS
// ============================================

/**
 * Transform a single API ticket to UI ticket
 */
export function transformTicket(apiTicket: ApiTicket): Ticket {
  return {
    id: apiTicket.ticket_id,
    title: apiTicket.ticket_title,
    description: apiTicket.ticket_description ?? "",
    status: apiTicket.ticket_status,
    priority: PRIORITY_MAP[apiTicket.ticket_priority] ?? "medium",
    createdAt: new Date(apiTicket.created_at),
    updatedAt: new Date(apiTicket.updated_at),
    assignee: apiTicket.assigned_to
      ? {
          id: apiTicket.assigned_to.user_id,
          name: apiTicket.assigned_to.user_name,
          email: apiTicket.assigned_to.user_email,
          avatarUrl: apiTicket.assigned_to.avatar_url,
        }
      : null,
    reporter: {
      id: apiTicket.reporter.user_id,
      name: apiTicket.reporter.user_name,
      email: apiTicket.reporter.user_email,
    },
    tags: apiTicket.tags,
  }
}

/**
 * Transform API tickets response to UI data
 */
export function transformTicketsResponse(response: ApiTicketsResponse): TicketsData {
  const { tickets, total, page, limit } = response.data

  return {
    tickets: tickets.map(transformTicket),
    total,
    page,
    limit,
    hasMore: page * limit < total,
  }
}
