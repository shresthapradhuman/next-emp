export const dynamic = 'force-dynamic'

import React from 'react'
import { getEventsListByCurrentUser } from '@/helper/event'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { DataTable } from '@/components/DataTable'
import { EventColumns } from '@/components/user/events/EventColumns'

const EventsListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string; sort?: string }>
}) => {
  const session = await auth()
  if (!session?.user?.id) {
    return redirect('/login')
  }

  const params = await searchParams

  const page = params.page ? parseInt(params.page) : 1
  const pageSize = params.pageSize ? parseInt(params.pageSize) : 10

  // Parse sorting parameters
  const sorting = params.sort
    ? [
        {
          id: params.sort.split('.')[0],
          desc: params.sort.split('.')[1] === 'desc',
        },
      ]
    : []

  try {
    const { data, pageCount } = await getEventsListByCurrentUser({
      id: session.user.id,
      page,
      pageSize,
      sorting,
    })

    return (
      <div className="relative z-10 container mx-auto w-full max-w-screen-xl px-4 py-4 md:px-16">
        <DataTable
          columns={EventColumns}
          data={data}
          pageCount={pageCount}
          pageSize={pageSize}
          currentPage={page}
        />
      </div>
    )
  } catch (error) {
    throw error
  }
}

export default EventsListPage
