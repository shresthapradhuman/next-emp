'use server'
import { z } from 'zod'
import { eventSchema } from '@/schema'
import prisma from '@/prisma/client'
import { auth } from '@/auth'

export const createEventAction = async (
  values: z.infer<typeof eventSchema>,
) => {
  try {
    /** check session expire  or not */
    const session = await auth()
    if (!session?.user) {
      return {
        success: false,
        message: 'User authentication failed',
      }
    }
    const { success, data } = eventSchema.safeParse(values)
    /** check event exist or not */
    if (!success) {
      return {
        success: false,
        message: 'Invalid event data',
      }
    }
    const newEvent = await prisma.event.create({
      data: {
        title: data.title.toLowerCase(),
        description: data.description,
        status: data.status,
        capacity: data.capacity,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        venue: data.venue,
        price: data.price,
        image: data.image,
        organizer: {
          connect: { id: session?.user?.id },
        },
        category: {
          connect: {
            id: data.categoryId,
          },
        },
      },
    })
    if (newEvent) {
      return {
        success: true,
        message: `${newEvent.title} is created successfully`,
      }
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: 'Internal server error',
    }
  }
}

export const updateEventAction = async (
  id: string,
  values: z.infer<typeof eventSchema>,
) => {
  try {
    /** check session expire  or not */
    const session = await auth()
    if (!session?.user) {
      return {
        success: false,
        message: 'User authentication failed',
      }
    }
    const { success } = eventSchema.safeParse(values)
    /** check event exist or not */
    if (!success) {
      return {
        success: false,
        message: 'Invalid event data',
      }
    }
    /** check event is available or not */
    const event = await prisma.event.findFirst({
      where: {
        id,
      },
    })
    if (!event) {
      return {
        success: false,
        message: 'Event not found',
      }
    }
    if (event.organizerId !== session?.user.id) {
      return {
        success: false,
        message: 'Invalid User Update',
      }
    }
    const updateEvent = await prisma.event.update({
      where: {
        id: event.id,
      },
      data: { organizerId: session?.user.id, ...values },
    })
    if (!updateEvent) {
      return {
        success: false,
        message: 'Failed to update.',
      }
    }
    return {
      success: true,
      message: `${event.title} is updated successfully.`,
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: 'Internal server error',
    }
  }
}

export const deleteEventAction = async (eventsId: string[]) => {
  try {
    const session = await auth()
    if (!session?.user) {
      return {
        success: false,
        message: 'User authentication failed',
      }
    }
    console.log(eventsId)
    const events = await prisma.event.findMany({
      where: {
        id: {
          in: eventsId,
        },
        organizer: {
          id: session?.user?.id,
        },
      },
    })
    if (events.length === 0) {
      return {
        success: false,
        message: `Events not found.`,
      }
    }
    const deleteEvents = await prisma.event.deleteMany({
      where: {
        id: {
          in: eventsId,
        },
      },
    })
    if (deleteEvents.count === 0) {
      return {
        success: false,
        message: 'Failed to delete the events',
      }
    }
    return {
      success: true,
      message: `${events.length} event(s) are deleted successfully`,
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: 'Internal server error',
    }
  }
}

export const createCategoryAction = async (name: string, order?: number) => {
  try {
    const category = await prisma.category.findFirst({
      where: {
        name,
      },
    })
    if (category) {
      return {
        success: false,
        message: 'Category already exist',
      }
    }
    const newCateogry = await prisma.category.create({
      data: {
        name,
        order: order || 0,
        slug: name.toLowerCase().replace(/ /g, '-'),
      },
    })
    return {
      success: true,
      data: newCateogry,
    }
  } catch (error) {
    console.log(error)
    return {
      success: false,
      message: 'Internal server error.',
    }
  }
}
