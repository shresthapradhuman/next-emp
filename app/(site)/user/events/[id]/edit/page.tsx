import React from 'react'
import EventForm from '@/components/user/events/EventForm'
import { getCategoryList } from '@/helper/event'
import prisma from '@/prisma/client'
import { notFound } from 'next/navigation'

const EventsEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  const event = await prisma.event.findFirst({
    where: {
      id,
    },
  })
  const categories = await getCategoryList()
  if (!event) {
    return notFound()
  }
  return (
    <div className="relative z-10 container mx-auto w-full max-w-screen-xl px-4 py-4 md:px-16">
      <EventForm categories={categories} event={event} />
    </div>
  )
}

export default EventsEditPage
