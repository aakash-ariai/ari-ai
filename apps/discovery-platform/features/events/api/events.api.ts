import { getApiClient } from "@workspace/shared/lib/api-client"
import type { ApiEvent, ApiEventsResponse, ApiEventResponse } from "../types/events.types"

// ============================================
// CONFIGURATION
// Set to false when backend API is ready
// ============================================
const USE_MOCK_DATA = true

// ============================================
// MOCK DATA (used during development)
// ============================================
const MOCK_EVENTS: ApiEvent[] = [
  {
    event_id: "evt_001",
    event_title: "TechConf 2024 - The Future of AI",
    event_description:
      "Join industry leaders and innovators for three days of cutting-edge discussions on artificial intelligence, machine learning, and the future of technology.",
    event_type: "conference",
    event_status: "upcoming",
    start_date: "2024-03-15T09:00:00Z",
    end_date: "2024-03-17T18:00:00Z",
    location: {
      venue_name: "Moscone Center",
      address: "747 Howard St",
      city: "San Francisco",
      country: "USA",
      is_virtual: false,
      virtual_url: null,
    },
    organizer: {
      organizer_id: "org_001",
      organizer_name: "TechEvents Inc.",
      organizer_logo: null,
    },
    ticket_info: {
      min_price: 299,
      max_price: 1499,
      currency: "USD",
      tickets_available: 450,
      total_tickets: 2000,
    },
    cover_image: null,
    tags: ["technology", "ai", "machine-learning", "networking"],
    attendees_count: 1550,
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    event_id: "evt_002",
    event_title: "React Workshop: Building Modern UIs",
    event_description:
      "A hands-on workshop covering React 19 features, Server Components, and best practices for building performant web applications.",
    event_type: "workshop",
    event_status: "upcoming",
    start_date: "2024-02-20T10:00:00Z",
    end_date: "2024-02-20T17:00:00Z",
    location: {
      venue_name: "Online Event",
      address: "",
      city: "",
      country: "",
      is_virtual: true,
      virtual_url: "https://zoom.us/j/123456789",
    },
    organizer: {
      organizer_id: "org_002",
      organizer_name: "Frontend Masters",
      organizer_logo: null,
    },
    ticket_info: {
      min_price: 0,
      max_price: 0,
      currency: "USD",
      tickets_available: 85,
      total_tickets: 100,
    },
    cover_image: null,
    tags: ["react", "javascript", "workshop", "free"],
    attendees_count: 15,
    created_at: "2024-01-10T00:00:00Z",
  },
  {
    event_id: "evt_003",
    event_title: "Startup Founders Meetup",
    event_description:
      "Monthly gathering of startup founders to share experiences, network, and learn from each other. Light refreshments provided.",
    event_type: "meetup",
    event_status: "live",
    start_date: "2024-01-20T18:00:00Z",
    end_date: "2024-01-20T21:00:00Z",
    location: {
      venue_name: "WeWork Soho",
      address: "123 Main Street",
      city: "New York",
      country: "USA",
      is_virtual: false,
      virtual_url: null,
    },
    organizer: {
      organizer_id: "org_003",
      organizer_name: "NYC Founders Network",
      organizer_logo: null,
    },
    ticket_info: {
      min_price: 10,
      max_price: 10,
      currency: "USD",
      tickets_available: 0,
      total_tickets: 50,
    },
    cover_image: null,
    tags: ["startup", "networking", "founders"],
    attendees_count: 50,
    created_at: "2024-01-05T00:00:00Z",
  },
  {
    event_id: "evt_004",
    event_title: "Digital Marketing Masterclass",
    event_description:
      "Learn advanced digital marketing strategies from industry experts. Covering SEO, paid advertising, content marketing, and analytics.",
    event_type: "webinar",
    event_status: "upcoming",
    start_date: "2024-02-28T14:00:00Z",
    end_date: "2024-02-28T16:00:00Z",
    location: {
      venue_name: "Online Webinar",
      address: "",
      city: "",
      country: "",
      is_virtual: true,
      virtual_url: "https://webinar.example.com/marketing",
    },
    organizer: {
      organizer_id: "org_004",
      organizer_name: "Marketing Pro Academy",
      organizer_logo: null,
    },
    ticket_info: {
      min_price: 49,
      max_price: 99,
      currency: "USD",
      tickets_available: 320,
      total_tickets: 500,
    },
    cover_image: null,
    tags: ["marketing", "digital", "seo", "webinar"],
    attendees_count: 180,
    created_at: "2024-01-12T00:00:00Z",
  },
  {
    event_id: "evt_005",
    event_title: "Jazz Night at Blue Note",
    event_description:
      "An evening of smooth jazz featuring local and international artists. Dinner and drinks available.",
    event_type: "concert",
    event_status: "ended",
    start_date: "2024-01-10T20:00:00Z",
    end_date: "2024-01-10T23:30:00Z",
    location: {
      venue_name: "Blue Note Jazz Club",
      address: "131 W 3rd St",
      city: "New York",
      country: "USA",
      is_virtual: false,
      virtual_url: null,
    },
    organizer: {
      organizer_id: "org_005",
      organizer_name: "Blue Note Entertainment",
      organizer_logo: null,
    },
    ticket_info: {
      min_price: 35,
      max_price: 85,
      currency: "USD",
      tickets_available: 0,
      total_tickets: 150,
    },
    cover_image: null,
    tags: ["music", "jazz", "nightlife"],
    attendees_count: 150,
    created_at: "2023-12-20T00:00:00Z",
  },
  {
    event_id: "evt_006",
    event_title: "Modern Art Exhibition: New Perspectives",
    event_description: null,
    event_type: "exhibition",
    event_status: "cancelled",
    start_date: "2024-02-01T10:00:00Z",
    end_date: "2024-03-01T18:00:00Z",
    location: {
      venue_name: "Metropolitan Gallery",
      address: "500 Art Avenue",
      city: "Los Angeles",
      country: "USA",
      is_virtual: false,
      virtual_url: null,
    },
    organizer: {
      organizer_id: "org_006",
      organizer_name: "LA Arts Foundation",
      organizer_logo: null,
    },
    ticket_info: {
      min_price: 15,
      max_price: 25,
      currency: "USD",
      tickets_available: 1000,
      total_tickets: 1000,
    },
    cover_image: null,
    tags: ["art", "exhibition", "modern-art"],
    attendees_count: 0,
    created_at: "2024-01-08T00:00:00Z",
  },
]

// ============================================
// MOCK HELPERS
// ============================================
function createMockResponse(
  events: ApiEvent[],
  page: number,
  limit: number
): ApiEventsResponse {
  const start = (page - 1) * limit
  const paginatedEvents = events.slice(start, start + limit)

  return {
    statusCode: 200,
    data: {
      events: paginatedEvents,
      total: events.length,
      page,
      limit,
    },
    message: "Events fetched successfully",
  }
}

async function simulateNetworkDelay(ms: number = 800): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

// ============================================
// API FUNCTIONS
// ============================================

export async function fetchEvents(
  page: number = 1,
  limit: number = 10
): Promise<ApiEventsResponse> {
  if (USE_MOCK_DATA) {
    await simulateNetworkDelay()
    return createMockResponse(MOCK_EVENTS, page, limit)
  }

  const client = getApiClient()
  return client.get<ApiEventsResponse>(`/events?page=${page}&limit=${limit}`)
}

export async function fetchEventById(id: string): Promise<ApiEventResponse> {
  if (USE_MOCK_DATA) {
    await simulateNetworkDelay(500)
    const event = MOCK_EVENTS.find((e) => e.event_id === id)

    if (!event) {
      throw new Error("Event not found")
    }

    return {
      statusCode: 200,
      data: event,
      message: "Event fetched successfully",
    }
  }

  const client = getApiClient()
  return client.get<ApiEventResponse>(`/events/${id}`)
}

export async function createEvent(
  data: Omit<ApiEvent, "event_id" | "created_at" | "attendees_count">
): Promise<ApiEventResponse> {
  if (USE_MOCK_DATA) {
    await simulateNetworkDelay()
    const newEvent: ApiEvent = {
      ...data,
      event_id: `evt_${Date.now()}`,
      attendees_count: 0,
      created_at: new Date().toISOString(),
    }
    return {
      statusCode: 201,
      data: newEvent,
      message: "Event created successfully",
    }
  }

  const client = getApiClient()
  return client.post<ApiEventResponse>("/events", data)
}

export async function updateEvent(
  id: string,
  data: Partial<ApiEvent>
): Promise<ApiEventResponse> {
  if (USE_MOCK_DATA) {
    await simulateNetworkDelay()
    const event = MOCK_EVENTS.find((e) => e.event_id === id)

    if (!event) {
      throw new Error("Event not found")
    }

    const updatedEvent: ApiEvent = {
      ...event,
      ...data,
    }
    return {
      statusCode: 200,
      data: updatedEvent,
      message: "Event updated successfully",
    }
  }

  const client = getApiClient()
  return client.patch<ApiEventResponse>(`/events/${id}`, data)
}

export async function deleteEvent(id: string): Promise<{ statusCode: number; message: string }> {
  if (USE_MOCK_DATA) {
    await simulateNetworkDelay()
    return {
      statusCode: 200,
      message: "Event deleted successfully",
    }
  }

  const client = getApiClient()
  return client.delete(`/events/${id}`)
}
