'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { formatEventDate, formatPrice } from '@/lib/utils'

import { ColumnDef } from '@tanstack/react-table'
import EventActions from './EventActions'
import { categories, statuses } from '@/constants'
import { DataTableSortableHeader } from '../../DataTableSortableHeader'
import { Category, Event } from '@prisma/client'

export const EventColumns: ColumnDef<
  Event & {
    category: Category | null
  }
>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: () => <DataTableSortableHeader field="title" title="Title" />,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('title')}</div>
    ),
  },
  {
    accessorKey: 'status',
    header: () => <DataTableSortableHeader field="status" title="Status" />,
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue('status'),
      )

      if (!status) {
        return null
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="text-muted-foreground mr-2 h-4 w-4" />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'category',
    header: () => <div className="font-bold">Category</div>,
    cell: ({ row }) => {
      const cat: Category = row.getValue('category')
      const category = categories.find(
        (category) => category.value === cat.slug,
      )
      if (!category) {
        return null
      }
      return (
        <div className="flex w-[100px] items-center">
          <span>{category.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const newId: Category = row.getValue(id)
      return value.includes(newId.slug)
    },
  },
  {
    accessorKey: 'date',
    header: () => (
      <DataTableSortableHeader field="date" title="Time Schedule" />
    ),
    cell: ({ row }) => (
      <div className="text-left">{formatEventDate(row.getValue('date'))}</div>
    ),
  },
  {
    accessorKey: 'venue',
    header: () => <div className="text-left font-bold">Venue</div>,
    cell: ({ row }) => (
      <div className="w-64 overflow-hidden">{row.getValue('venue')}</div>
    ),
  },
  {
    accessorKey: 'capacity',
    header: () => <div className="text-center font-bold">Attendees</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.getValue('capacity')}</div>
    ),
  },
  {
    accessorKey: 'price',
    header: () => <div className="text-center font-bold">Price</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue('price') == 0
          ? 'Free'
          : formatPrice(row.getValue('price'), 'JPY')}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="text-center">
        <EventActions id={row.original.id} />
      </div>
    ),
  },
]
