"use client"

import { Card, CardContent, CardHeader } from "@workspace/shared/components/card"

function EventCardSkeleton() {
  return (
    <Card className="animate-pulse overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-3">
            <div className="flex gap-2">
              <div className="h-5 w-20 bg-muted rounded-full" />
              <div className="h-5 w-16 bg-muted rounded-full" />
            </div>
            <div className="h-6 bg-muted rounded w-3/4" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-48" />
          <div className="h-4 bg-muted rounded w-36" />
          <div className="h-4 bg-muted rounded w-28" />
        </div>
        <div className="flex justify-between pt-2 border-t">
          <div className="h-5 bg-muted rounded w-20" />
          <div className="h-5 bg-muted rounded w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

export function EventListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  )
}
