import EventCard from '@/components/EventCard'
import EventsFilters from '@/components/events/EventsFilters'
import EventsSearchInput from '@/components/events/EventsSearchInput'
import { cn } from '@/lib/utils'
import prisma from '@/prisma/client'
import React from 'react'

type EventListProps = {
  searchParams: Promise<{
    view?: 'grid' | 'list'
    sort?: 'date-asc' | 'date-desc' | 'price-asc' | 'price-desc'
    category?: string
    keyword?: string
  }>
}

const EventsPage = async ({ searchParams }: EventListProps) => {
  const { view, sort, category, keyword } = await searchParams
  const viewMode = view === 'list' ? 'list' : 'grid'

  const events = await prisma.event.findMany({
    where: {
      OR: keyword
        ? [
            { title: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
          ]
        : undefined,
      category: category ? { slug: category } : undefined,
    },
    orderBy: {
      [sort?.split('-')[0] || 'createdAt']:
        sort?.split('-')[1] === 'asc' ? 'asc' : 'desc',
    },
    include: {
      category: true,
      organizer: true,
    },
  })
  return (
    <div className="relative z-10 container mx-auto w-full max-w-screen-xl px-4 py-4 md:px-16">
      <div className="mb-6 flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:w-1/3">
            <EventsSearchInput placeholder="Search events ..." />
          </div>
          <div className="flex items-center gap-4">
            <EventsFilters />
            {/* <EventsViewModeToggle currentViewMode={viewMode} /> */}
          </div>
        </div>
      </div>
      <div
        className={cn('flex flex-col gap-4', {
          'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3':
            viewMode == 'grid',
        })}
      >
        {events.length > 0 ? (
          events.map((event) => <EventCard key={event.id} event={event} />)
        ) : (
          <p>No events found</p>
        )}
      </div>
    </div>
  )
}

export default EventsPage
