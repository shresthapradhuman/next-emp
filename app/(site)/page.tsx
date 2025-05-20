export const dynamic = 'force-dynamic'

import CategorySection from '@/components/CategorySection'
import HeroSection from '@/components/HeroSection'
import UpcomingEventsSection from '@/components/UpcomingEventsSection'
import { getUpcomingEvents } from '@/helper/event'
import prisma from '@/prisma/client'

export default async function Home() {
  const categories = await prisma.category.findMany({
    orderBy: {
      order: 'asc',
    },
  })
  const upcomingEvents = await getUpcomingEvents()
  return (
    <>
      <HeroSection />
      <CategorySection categories={categories} />
      <UpcomingEventsSection events={upcomingEvents} />
    </>
  )
}
