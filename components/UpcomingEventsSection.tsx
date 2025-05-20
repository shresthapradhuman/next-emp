import React from 'react'
import EventCard from './EventCard'
import { Category, Event, User } from '@prisma/client'

const UpcomingEventsSection = ({
  events,
}: {
  events: (Event & {
    category: Category | null
    organizer: User | null
  })[]
}) => {
  return (
    <section className="bg-background w-full py-12 md:py-16 lg:py-24">
      <div className="container mx-auto max-w-screen-xl px-4 md:px-16">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Upcoming Events
            </h2>
            <p className="text-foreground max-w-[900px] md:text-xl">
              Experience the best of the season with our curated selection of
              upcoming events.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-8 grid grid-cols-1 justify-center gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 lg:gap-8">
          {events.map((event, key) => (
            <EventCard key={key} event={event} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default UpcomingEventsSection
