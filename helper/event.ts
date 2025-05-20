import prisma from '@/prisma/client'
import { User } from 'next-auth'
import { SortingState } from '@tanstack/react-table'

export type EventsQueryParams = {
  id: User['id']
  page?: number
  pageSize?: number
  sorting?: SortingState
}

export const getEventsListByCurrentUser = async ({
  id,
  page = 1,
  pageSize = 10,
  sorting = [],
}: EventsQueryParams) => {
  try {
    if (!id) {
      throw new Error('User ID is required')
    }

    const skip = (page - 1) * pageSize

    // Build orderBy object based on sorting state
    const orderBy: { [key: string]: 'asc' | 'desc' }[] =
      sorting?.map((sort) => ({
        [sort.id]: sort.desc ? ('desc' as const) : ('asc' as const),
      })) ?? []

    // Directly fetch from database to ensure fresh data
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where: { organizerId: id },
        skip,
        take: pageSize,
        orderBy: orderBy.length > 0 ? orderBy : [{ createdAt: 'desc' }],
        include: {
          category: true,
          organizer: true,
        },
      }),
      prisma.event.count({
        where: { organizerId: id },
      }),
    ])

    return {
      data: events,
      pageCount: Math.ceil(total / pageSize),
      total,
    }
  } catch (error) {
    console.error('Error fetching events:', error)
    throw new Error('Failed to fetch events')
  }
}

export const getCategoryList = async () => {
  return await prisma.category.findMany({
    orderBy: {
      order: 'asc',
    },
  })
}

export const getUpcomingEvents = async () => {
  const now = new Date()
  // Set time to start of today
  now.setHours(0, 0, 0, 0)

  const events = await prisma.event.findMany({
    where: {
      status: 'Published',
      date: {
        gte: now,
      },
    },
    include: {
      category: true,
      organizer: true,
    },
    orderBy: {
      date: 'asc',
    },
    take: 6,
  })
  return events
}
