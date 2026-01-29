import { getApiClient } from "@workspace/shared/lib/api-client"
import type { ApiTicket, ApiTicketsResponse, ApiTicketResponse } from "../types/tickets.types"

// ============================================
// CONFIGURATION
// Set to false when backend API is ready
// ============================================
const USE_MOCK_DATA = true

// ============================================
// MOCK DATA (used during development)
// ============================================
const MOCK_TICKETS: ApiTicket[] = [
  {
    ticket_id: "tkt_001",
    ticket_title: "Login button not working on mobile",
    ticket_description:
      "Users are reporting that the login button is unresponsive on iOS Safari. The issue started after the last deployment.",
    ticket_status: "open",
    ticket_priority: 2,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T14:22:00Z",
    assigned_to: {
      user_id: "usr_001",
      user_name: "Sarah Chen",
      user_email: "sarah@company.com",
      avatar_url: null,
    },
    reporter: {
      user_id: "usr_005",
      user_name: "Mike Johnson",
      user_email: "mike@company.com",
    },
    tags: ["bug", "mobile", "high-priority"],
  },
  {
    ticket_id: "tkt_002",
    ticket_title: "Dashboard loading extremely slow",
    ticket_description:
      "The main dashboard takes over 10 seconds to load. This is affecting productivity for all users.",
    ticket_status: "in_progress",
    ticket_priority: 1,
    created_at: "2024-01-14T09:00:00Z",
    updated_at: "2024-01-15T16:45:00Z",
    assigned_to: {
      user_id: "usr_002",
      user_name: "Alex Rivera",
      user_email: "alex@company.com",
      avatar_url: null,
    },
    reporter: {
      user_id: "usr_006",
      user_name: "Emily Davis",
      user_email: "emily@company.com",
    },
    tags: ["performance", "critical"],
  },
  {
    ticket_id: "tkt_003",
    ticket_title: "Add export to PDF feature",
    ticket_description:
      "Users need the ability to export reports as PDF documents for offline viewing and sharing.",
    ticket_status: "open",
    ticket_priority: 4,
    created_at: "2024-01-13T16:45:00Z",
    updated_at: "2024-01-13T16:45:00Z",
    assigned_to: null,
    reporter: {
      user_id: "usr_007",
      user_name: "David Kim",
      user_email: "david@company.com",
    },
    tags: ["feature-request", "export"],
  },
  {
    ticket_id: "tkt_004",
    ticket_title: "Email notifications not being sent",
    ticket_description:
      "Users are not receiving email notifications for new assignments and status changes.",
    ticket_status: "resolved",
    ticket_priority: 2,
    created_at: "2024-01-12T11:20:00Z",
    updated_at: "2024-01-14T09:30:00Z",
    assigned_to: {
      user_id: "usr_003",
      user_name: "Jordan Lee",
      user_email: "jordan@company.com",
      avatar_url: null,
    },
    reporter: {
      user_id: "usr_008",
      user_name: "Lisa Wang",
      user_email: "lisa@company.com",
    },
    tags: ["bug", "notifications"],
  },
  {
    ticket_id: "tkt_005",
    ticket_title: "Implement dark mode support",
    ticket_description: null,
    ticket_status: "closed",
    ticket_priority: 5,
    created_at: "2024-01-10T14:00:00Z",
    updated_at: "2024-01-13T10:15:00Z",
    assigned_to: {
      user_id: "usr_001",
      user_name: "Sarah Chen",
      user_email: "sarah@company.com",
      avatar_url: null,
    },
    reporter: {
      user_id: "usr_009",
      user_name: "Tom Brown",
      user_email: "tom@company.com",
    },
    tags: ["feature-request", "ui"],
  },
  {
    ticket_id: "tkt_006",
    ticket_title: "API rate limiting causing failures",
    ticket_description:
      "When multiple users access the system simultaneously, API calls are being rate limited and returning 429 errors.",
    ticket_status: "in_progress",
    ticket_priority: 1,
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T17:30:00Z",
    assigned_to: {
      user_id: "usr_004",
      user_name: "Chris Martinez",
      user_email: "chris@company.com",
      avatar_url: null,
    },
    reporter: {
      user_id: "usr_010",
      user_name: "Anna Wilson",
      user_email: "anna@company.com",
    },
    tags: ["bug", "api", "critical"],
  },
]

// ============================================
// MOCK HELPERS
// ============================================
function createMockResponse(
  tickets: ApiTicket[],
  page: number,
  limit: number
): ApiTicketsResponse {
  const start = (page - 1) * limit
  const paginatedTickets = tickets.slice(start, start + limit)

  return {
    statusCode: 200,
    data: {
      tickets: paginatedTickets,
      total: tickets.length,
      page,
      limit,
    },
    message: "Tickets fetched successfully",
  }
}

async function simulateNetworkDelay(ms: number = 800): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

// ============================================
// API FUNCTIONS
// ============================================

export async function fetchTickets(
  page: number = 1,
  limit: number = 10
): Promise<ApiTicketsResponse> {
  if (USE_MOCK_DATA) {
    await simulateNetworkDelay()
    return createMockResponse(MOCK_TICKETS, page, limit)
  }

  const client = getApiClient()
  return client.get<ApiTicketsResponse>(`/tickets?page=${page}&limit=${limit}`)
}

export async function fetchTicketById(id: string): Promise<ApiTicketResponse> {
  if (USE_MOCK_DATA) {
    await simulateNetworkDelay(500)
    const ticket = MOCK_TICKETS.find((t) => t.ticket_id === id)

    if (!ticket) {
      throw new Error("Ticket not found")
    }

    return {
      statusCode: 200,
      data: ticket,
      message: "Ticket fetched successfully",
    }
  }

  const client = getApiClient()
  return client.get<ApiTicketResponse>(`/tickets/${id}`)
}

export async function createTicket(
  data: Omit<ApiTicket, "ticket_id" | "created_at" | "updated_at">
): Promise<ApiTicketResponse> {
  if (USE_MOCK_DATA) {
    await simulateNetworkDelay()
    const newTicket: ApiTicket = {
      ...data,
      ticket_id: `tkt_${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return {
      statusCode: 201,
      data: newTicket,
      message: "Ticket created successfully",
    }
  }

  const client = getApiClient()
  return client.post<ApiTicketResponse>("/tickets", data)
}

export async function updateTicket(
  id: string,
  data: Partial<ApiTicket>
): Promise<ApiTicketResponse> {
  if (USE_MOCK_DATA) {
    await simulateNetworkDelay()
    const ticket = MOCK_TICKETS.find((t) => t.ticket_id === id)

    if (!ticket) {
      throw new Error("Ticket not found")
    }

    const updatedTicket: ApiTicket = {
      ...ticket,
      ...data,
      updated_at: new Date().toISOString(),
    }
    return {
      statusCode: 200,
      data: updatedTicket,
      message: "Ticket updated successfully",
    }
  }

  const client = getApiClient()
  return client.patch<ApiTicketResponse>(`/tickets/${id}`, data)
}

export async function deleteTicket(id: string): Promise<{ statusCode: number; message: string }> {
  if (USE_MOCK_DATA) {
    await simulateNetworkDelay()
    return {
      statusCode: 200,
      message: "Ticket deleted successfully",
    }
  }

  const client = getApiClient()
  return client.delete(`/tickets/${id}`)
}
