'use client'
import { Button } from '@/components/ui/button'
import { User } from 'next-auth'
import React, { useEffect } from 'react'
import { checkoutAction } from '@/actions/checkout'
import { loadStripe } from '@stripe/stripe-js'
import { cn } from '@/lib/utils'
import { Event } from '@prisma/client'

interface CheckoutProps {
  event: Event
  userId: User['id']
  className?: string
}

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const Checkout = ({ event, userId, className }: CheckoutProps) => {
  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    if (query.get('success')) {
      console.log('payment success')
    }
    if (query.get('canceled')) {
      console.log('payment canceled')
    }
  }, [])
  const onCheckout = async () => {
    const order = {
      eventTitle: event.title,
      eventId: event.id,
      buyerId: userId || '',
      price: event.price,
      isFree: event.price == '0',
    }
    await checkoutAction(order)
  }
  return (
    <Button
      type="submit"
      className={cn('cursor-pointer', className)}
      onClick={onCheckout}
    >
      Get Tickets
    </Button>
  )
}

export default Checkout
