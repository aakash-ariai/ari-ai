import type { ApiEvent, ApiEventsResponse, Event, EventsData } from "../types/events.types"

// ============================================
// HELPERS
// ============================================

function formatPriceRange(minPrice: number, maxPrice: number, currency: string): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  if (minPrice === 0 && maxPrice === 0) {
    return "Free"
  }

  if (minPrice === maxPrice) {
    return formatter.format(minPrice)
  }

  return `${formatter.format(minPrice)} - ${formatter.format(maxPrice)}`
}

function calculatePercentageSold(available: number, total: number): number {
  if (total === 0) return 0
  return Math.round(((total - available) / total) * 100)
}

// ============================================
// TRANSFORMERS
// ============================================

/**
 * Transform a single API event to UI event
 */
export function transformEvent(apiEvent: ApiEvent): Event {
  const { ticket_info } = apiEvent
  const percentageSold = calculatePercentageSold(
    ticket_info.tickets_available,
    ticket_info.total_tickets
  )

  return {
    id: apiEvent.event_id,
    title: apiEvent.event_title,
    description: apiEvent.event_description ?? "",
    type: apiEvent.event_type,
    status: apiEvent.event_status,
    startDate: new Date(apiEvent.start_date),
    endDate: new Date(apiEvent.end_date),
    location: {
      venueName: apiEvent.location.venue_name,
      address: apiEvent.location.address,
      city: apiEvent.location.city,
      country: apiEvent.location.country,
      isVirtual: apiEvent.location.is_virtual,
      virtualUrl: apiEvent.location.virtual_url,
    },
    organizer: {
      id: apiEvent.organizer.organizer_id,
      name: apiEvent.organizer.organizer_name,
      logo: apiEvent.organizer.organizer_logo,
    },
    pricing: {
      minPrice: ticket_info.min_price,
      maxPrice: ticket_info.max_price,
      currency: ticket_info.currency,
      isFree: ticket_info.min_price === 0 && ticket_info.max_price === 0,
      priceRange: formatPriceRange(
        ticket_info.min_price,
        ticket_info.max_price,
        ticket_info.currency
      ),
    },
    availability: {
      ticketsAvailable: ticket_info.tickets_available,
      totalTickets: ticket_info.total_tickets,
      percentageSold,
      isSoldOut: ticket_info.tickets_available === 0,
    },
    coverImage: apiEvent.cover_image,
    tags: apiEvent.tags,
    attendeesCount: apiEvent.attendees_count,
    createdAt: new Date(apiEvent.created_at),
  }
}

/**
 * Transform API events response to UI data
 */
export function transformEventsResponse(response: ApiEventsResponse): EventsData {
  const { events, total, page, limit } = response.data

  return {
    events: events.map(transformEvent),
    total,
    page,
    limit,
    hasMore: page * limit < total,
  }
}
