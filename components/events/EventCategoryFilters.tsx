'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Category } from '@prisma/client'

interface EventsCategoryFiltersProps {
  categories: Category[]
}

const EventsCategoryFilters = ({ categories }: EventsCategoryFiltersProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedValue, setSelectedValue] = useState<string | null>('all')
  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedValue(searchParams.get('category'))
    } else {
      setSelectedValue('all')
    }
  }, [searchParams])
  const onSelectCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category && category !== 'all') {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    router.push(`/events?${params.toString()}`, { scroll: false })
  }
  return (
    <Select
      value={selectedValue!}
      onValueChange={(value: string) => onSelectCategory(value)}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all" className="p-regular-14 w-[200px]">
          All Category
        </SelectItem>
        {categories.map((category) => (
          <SelectItem
            value={category.slug}
            key={category.id}
            className="p-regular-14 w-[200px]"
          >
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default EventsCategoryFilters
