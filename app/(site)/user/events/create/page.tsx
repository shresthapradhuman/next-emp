import React from 'react'
import { getCategoryList } from '@/helper/event'
import EventForm from '@/components/user/events/EventForm'

const EventsCreatePage = async () => {
  const categories = await getCategoryList()
  return (
    <div className="relative z-10 container mx-auto w-full max-w-screen-xl px-4 py-4 md:px-16">
      <EventForm categories={categories} />
    </div>
  )
}

export default EventsCreatePage
