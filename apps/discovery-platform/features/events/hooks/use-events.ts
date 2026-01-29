import { useQuery } from "@tanstack/react-query"

import { fetchEvents, fetchEventById } from "../api/events.api"
import { transformEventsResponse, transformEvent } from "../transformers/events.transformers"
import type { Event, EventsData } from "../types/events.types"

// ============================================
// QUERY KEYS
// ============================================
export const eventKeys = {
  all: ["events"] as const,
  lists: () => [...eventKeys.all, "list"] as const,
  list: (page: number, limit: number) => [...eventKeys.lists(), { page, limit }] as const,
  details: () => [...eventKeys.all, "detail"] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
}

// ============================================
// HOOKS
// ============================================

/**
 * Fetch paginated events list
 * Returns TRANSFORMED data ready for UI
 */
export function useEvents(page: number = 1, limit: number = 10) {
  return useQuery<EventsData>({
    queryKey: eventKeys.list(page, limit),
    queryFn: async () => {
      const response = await fetchEvents(page, limit)
      return transformEventsResponse(response)
    },
  })
}

/**
 * Fetch single event by ID
 * Returns TRANSFORMED data ready for UI
 */
export function useEvent(id: string) {
  return useQuery<Event>({
    queryKey: eventKeys.detail(id),
    queryFn: async () => {
      const response = await fetchEventById(id)
      return transformEvent(response.data)
    },
    enabled: !!id,
  })
}
