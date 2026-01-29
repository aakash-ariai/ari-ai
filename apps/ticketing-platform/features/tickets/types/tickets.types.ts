// ============================================
// API TYPES (match backend response)
// ============================================
export interface ApiTicket {
  ticket_id: string
  ticket_title: string
  ticket_description: string | null
  ticket_status: "open" | "in_progress" | "resolved" | "closed"
  ticket_priority: 1 | 2 | 3 | 4 | 5
  created_at: string
  updated_at: string
  assigned_to: {
    user_id: string
    user_name: string
    user_email: string
    avatar_url: string | null
  } | null
  reporter: {
    user_id: string
    user_name: string
    user_email: string
  }
  tags: string[]
}

export interface ApiTicketsResponse {
  statusCode: number
  data: {
    tickets: ApiTicket[]
    total: number
    page: number
    limit: number
  }
  message: string
}

export interface ApiTicketResponse {
  statusCode: number
  data: ApiTicket
  message: string
}

// ============================================
// UI TYPES (what components consume)
// ============================================
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed"
export type TicketPriority = "low" | "medium" | "high" | "urgent" | "critical"

export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  createdAt: Date
  updatedAt: Date
  assignee: {
    id: string
    name: string
    email: string
    avatarUrl: string | null
  } | null
  reporter: {
    id: string
    name: string
    email: string
  }
  tags: string[]
}

export interface TicketsData {
  tickets: Ticket[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
