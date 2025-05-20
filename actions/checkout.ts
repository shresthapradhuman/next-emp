'use server'

import config from '@/lib/config'

import { redirect } from 'next/navigation'
import Stripe from 'stripe'

const {
  stripe: { secretKey },
  baseUrl,
} = config

const stripe = new Stripe(secretKey, {
  apiVersion: '2025-04-30.basil',
})

interface CheckoutProps {
  eventId: string
  price: string
  isFree: boolean
  eventTitle: string
  buyerId: string
}

export async function checkoutAction(item: CheckoutProps) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'jpy',
          product_data: {
            name: item.eventTitle,
          },
          unit_amount: parseInt(item.price),
        },
        quantity: 1,
      },
    ],
    metadata: {
      eventId: item.eventId,
      buyerId: item.buyerId,
    },
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/checkout/cancel`,
  })
  redirect(session.url!)
}


