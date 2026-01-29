import { TicketList } from "@/features/tickets"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tickets</h1>
        <p className="text-muted-foreground mt-1">Manage and track all support tickets</p>
      </div>

      <TicketList />
    </div>
  )
}
