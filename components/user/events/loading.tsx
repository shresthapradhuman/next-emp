'use client'

import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="relative z-10 container mx-auto w-full max-w-screen-xl px-4 py-4 md:px-16">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-8 w-[100px]" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-8 w-[100px]" />
          </div>
        </div>
        <div className="rounded-md border">
          <div className="h-[400px] relative">
            <Skeleton className="absolute inset-0" />
          </div>
        </div>
      </div>
    </div>
  )
}
