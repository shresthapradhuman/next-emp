import prisma from '@/prisma/client'
import EventsSortFilters from './EventSortFilters'
import EventsCategoryFilters from './EventCategoryFilters'

const EventsFilters = async () => {
  const categories = await prisma.category.findMany()
  return (
    <div className="flex items-center gap-2">
      <EventsCategoryFilters categories={categories} />
      <EventsSortFilters />
    </div>
  )
}

export default EventsFilters
