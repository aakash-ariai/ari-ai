// ============================================
// API TYPES (match backend response)
// ============================================
export interface ApiEvent {
  event_id: string
  event_title: string
  event_description: string | null
  event_type: "conference" | "workshop" | "meetup" | "webinar" | "concert" | "exhibition"
  event_status: "upcoming" | "live" | "ended" | "cancelled"
  start_date: string
  end_date: string
  location: {
    venue_name: string
    address: string
    city: string
    country: string
    is_virtual: boolean
    virtual_url: string | null
  }
  organizer: {
    organizer_id: string
    organizer_name: string
    organizer_logo: string | null
  }
  ticket_info: {
    min_price: number
    max_price: number
    currency: string
    tickets_available: number
    total_tickets: number
  }
  cover_image: string | null
  tags: string[]
  attendees_count: number
  created_at: string
}

export interface ApiEventsResponse {
  statusCode: number
  data: {
    events: ApiEvent[]
    total: number
    page: number
    limit: number
  }
  message: string
}

export interface ApiEventResponse {
  statusCode: number
  data: ApiEvent
  message: string
}

// ============================================
// UI TYPES (what components consume)
// ============================================
export type EventType = "conference" | "workshop" | "meetup" | "webinar" | "concert" | "exhibition"
export type EventStatus = "upcoming" | "live" | "ended" | "cancelled"

export interface Event {
  id: string
  title: string
  description: string
  type: EventType
  status: EventStatus
  startDate: Date
  endDate: Date
  location: {
    venueName: string
    address: string
    city: string
    country: string
    isVirtual: boolean
    virtualUrl: string | null
  }
  organizer: {
    id: string
    name: string
    logo: string | null
  }
  pricing: {
    minPrice: number
    maxPrice: number
    currency: string
    isFree: boolean
    priceRange: string
  }
  availability: {
    ticketsAvailable: number
    totalTickets: number
    percentageSold: number
    isSoldOut: boolean
  }
  coverImage: string | null
  tags: string[]
  attendeesCount: number
  createdAt: Date
}

export interface EventsData {
  events: Event[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
