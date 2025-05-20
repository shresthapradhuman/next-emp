import Link from 'next/link'
import React from 'react'
import stripe from '@/lib/stripe'

const CheckoutSuccessPage = async ( { searchParams }: { searchParams: Promise<{ session_id: string }> } ) => {
  const { session_id } = await searchParams
  const order = await stripe.checkout.sessions.retrieve(session_id)
  console.log(order)
  return (
    <div className='flex items-center justify-center h-screen flex-col gap-2'>
      <h1 className='text-2xl font-bold'>Checkout Success</h1>
      <p className='text-muted-foreground'>Thank you for your purchase</p> 
      <p className='text-muted-foreground'>Order Number: {order.id}</p>
      <Link href="/events" className='text-primary hover:underline'>Back to Events</Link>
    </div>
  )
}

export default CheckoutSuccessPage