'use client'
import React from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { convertToAmPm, formatEventDate, formatPrice } from '@/lib/utils'

import { CalendarDaysIcon, MapPinIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Category, Event, User } from '@prisma/client'

const EventCard = ({
  event,
}: {
  event: Event & {
    category: Category | null
    organizer: User | null
  }
}) => {
  const router = useRouter()
  const handleClick = () => {
    router.push(`/events/${event.id}`)
  }
  return (
    <Card
      className="group bg-background hover:border-primary relative cursor-pointer overflow-hidden rounded-lg border p-0 shadow transition-colors"
      onClick={handleClick}
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <Image
          src={event.image || '/placeholder.svg'}
          alt={event.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          priority
          quality={90}
        />
        <Badge
          variant={'default'}
          className="absolute top-4 left-4 z-30 text-xs font-bold"
        >
          {event.category?.name}
        </Badge>
      </div>
      <CardContent className="p-4">
        <div>
          <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
            <CalendarDaysIcon className="h-4 w-4" />
            <span>
              {formatEventDate(event.date)}, {convertToAmPm(event.startTime)}
            </span>
          </div>
          <h3 className="line-clamp-1 font-semibold capitalize">
            {event.title}
          </h3>
          <p className="text-muted-foreground mt-1 mb-2 line-clamp-1 text-sm">
            {event.description}
          </p>
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage
                src={event.organizer?.image || ''}
                alt={event.organizer?.name || 'user'}
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <p className="text-muted-foreground/80 text-sm font-semibold">
              By {event.organizer?.name}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <MapPinIcon className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground line-clamp-1 text-sm">
                {event.venue}
              </span>
            </div>
            <div className="text-sm font-bold">
              {event.price === '0'
                ? 'Free'
                : formatPrice(parseInt(event.price), 'JPY')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default EventCard
