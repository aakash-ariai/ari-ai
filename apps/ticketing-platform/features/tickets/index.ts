// Components
export * from "./components"

// Hooks
export { useTickets, useTicket, ticketKeys } from "./hooks/use-tickets"

// Types (only UI types - never expose API types)
export type { Ticket, TicketsData, TicketStatus, TicketPriority } from "./types/tickets.types"
