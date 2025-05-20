'use server'
import prisma from '@/prisma/client'
import { createOrderSchema } from '@/schema'
import { z } from 'zod'

export const createOrder = async (item: z.infer<typeof createOrderSchema>) => {
  try {
    const { data, success } = createOrderSchema.safeParse(item)
    if (!success)
      return {
        success: false,
        message: 'Invalid data',
      }
    const newOrder = await prisma.order.create({
      data: {
        stripeId: data.stripeId,
        totalAmount: data.totalAmount,
        eventId: data.eventId,
        buyerId: data.buyerId,
      },
    })
    return {
      success: true,
      message: 'Order created successfully',
      orderId: newOrder.id,
    }
  } catch (error) {
    console.log('Something went wrong' + error)
    return {
      success: false,
      message: 'Something went wrong',
    }
  }
}
