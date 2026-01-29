import { EventList } from "@/features/events"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Discover Events</h1>
        <p className="text-muted-foreground mt-1">
          Find and explore upcoming events, workshops, and experiences
        </p>
      </div>

      <EventList />
    </div>
  )
}
