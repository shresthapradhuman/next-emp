import { Badge } from '@/components/ui/badge'
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  HeartIcon,
  MapPinIcon,
  Share2Icon,
  StarIcon,
  TicketIcon,
  Users,
} from 'lucide-react'
import React from 'react'
import { Metadata } from 'next'
import prisma from '@/prisma/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { convertToAmPm, formatEventDate, formatPrice } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CheckoutButton from '@/components/events/CheckoutButton'

type PageProps = {
  params: Promise<{ id: string }>
}

const EventDetailPage = async ({ params }: PageProps) => {
  const { id } = await params
  const event = await prisma.event.findFirst({
    where: { id },
    include: {
      category: true,
      organizer: true,
    },
  })
  return !event ? (
    <div className="relative z-10 container mx-auto w-full max-w-screen-xl px-4 py-4 md:px-16">
      Event Not Found
    </div>
  ) : (
    <div className="bg-secondary/5">
      <div className="relative z-10 container mx-auto w-full max-w-screen-xl px-4 py-4 md:px-16">
        <Link
          href="/events"
          className="text-muted-foreground flex items-center gap-2"
        >
          <ArrowLeftIcon className="inline-block h-4 w-4 stroke-3" />
          Back to Events
        </Link>
      </div>
      <section className="relative">
        <div className="relative aspect-video h-[500px] w-full">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover object-top"
            priority
            quality={90}
          />
        </div>
        <div className="relative z-10 container mx-auto -mt-24 w-full max-w-screen-xl px-4 py-4 md:px-16">
          <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
            {/* Event info */}
            <div className="bg-background rounded-lg p-6 shadow-lg">
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge variant={'secondary'}>{event.category?.name}</Badge>
                {event.status === 'Published' && (
                  <Badge variant={'secondary'}>Published</Badge>
                )}
                {event.status === 'Cancelled' && (
                  <Badge variant={'destructive'}>Cancelled</Badge>
                )}
              </div>
              <h1 className="mb-4 text-2xl font-bold capitalize sm:text-3xl md:text-4xl">
                {event.title}
              </h1>
              <div className="mb-6 grid gap-3 sm:grid-cols-2">
                <div className="flex items-start gap-2">
                  <CalendarDaysIcon className="text-muted-foreground mt-0.5 h-5 w-5" />
                  <div>
                    <p className="font-semibold">Date & Time</p>
                    <p className="text-muted-foreground text-sm">
                      {formatEventDate(event.date)} (
                      {convertToAmPm(event.startTime)} ~{' '}
                      {convertToAmPm(event.endTime)})
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPinIcon className="text-muted-foreground h-5 w-5" />
                  <div className="-mt-1 flex flex-col">
                    <p className="font-semibold">Location</p>
                    <p className="text-muted-foreground text-sm">
                      {event.venue}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Users className="text-muted-foreground mt-0.5 h-5 w-5" />
                  <div>
                    <p className="font-semibold">Total Seats</p>
                    <p className="text-muted-foreground text-sm">
                      {event?.capacity} seats
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <TicketIcon className="text-muted-foreground mt-0.5 h-5 w-5" />
                  <div>
                    <p className="font-semibold">Organized By</p>
                    <p className="text-muted-foreground text-sm">
                      {event.organizer?.name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="sm" variant="outline" className="gap-1.5">
                  <HeartIcon className="h-4 w-4" />
                  Add to Favorites
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Share2Icon className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
            {/* Ticket purchase */}
            <div className="bg-background h-fit rounded-lg p-6 shadow-lg">
              <div className="mb-4 flex items-baseline justify-between">
                <span className="text-2xl font-bold">
                  {formatPrice(parseInt(event.price), 'JPY')}
                </span>
                <div className="flex items-center text-sm">
                  <StarIcon className="fill-primary text-primary mr-1 h-4 w-4" />
                  <span>{4.5} (200 reviews)</span>
                </div>
              </div>

              <div className="mb-4 space-y-3">
                <div className="flex justify-between rounded-md border p-3">
                  <div className="flex items-center">
                    <TicketIcon className="text-primary mr-2 h-5 w-5" />
                    <span>Ticket Price</span>
                  </div>
                  <span className="font-semibold">
                    {formatPrice(parseInt(event.price), 'JPY')}
                  </span>
                </div>
              </div>
              <CheckoutButton event={event} className="mb-3 w-full" />
              <p className="text-muted-foreground text-center text-xs">
                Only {event.capacity} tickets left at this price
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="relative z-10 container mx-auto w-full max-w-screen-xl px-4 py-4 md:px-16">
        <Tabs
          defaultValue="description"
          className="bg-background rounded-lg p-6 shadow-lg"
        >
          <TabsList className="w-full justify-start space-x-2 rounded-none border-b bg-transparent shadow">
            <TabsTrigger
              value="description"
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary mb-2 grow-0 cursor-pointer text-base font-semibold"
            >
              Description
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="description"
            className="bg-background space-y-6 rounded-lg py-6 shadow-lg"
          >
            <div>
              <h2 className="mb-4 text-2xl font-bold">About This Event</h2>
              <div className="prose max-w-none">
                <p>{event.description}</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent
            value="test"
            className="bg-background space-y-6 rounded-lg p-6 shadow-lg"
          >
            <div>
              <h2 className="mb-4 text-2xl font-bold">Test</h2>
              <div className="prose max-w-none">
                <p>{event.description}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const event = await prisma.event.findFirst({ where: { id } })

  return {
    title: event?.title,
    description: event?.description,
  }
}

export const dynamic = 'force-dynamic'

export default EventDetailPage
