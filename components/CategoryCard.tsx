'use client'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Category } from '@prisma/client'

const CategoryCard = ({ category }: { category: Category }) => {
  const router = useRouter()
  const onClick = () => {
    router.push(`/events?category=${category.slug}`)
  }
  return (
    <Card className="bg-primary/50 text-primary-foreground flex aspect-square cursor-pointer items-center justify-center rounded-full border-none shadow sm:h-24 sm:w-24 md:h-24 md:w-24 lg:h-36 lg:w-36 xl:h-44 xl:w-44">
      <CardContent
        className="grid justify-items-center sm:gap-2"
        onClick={onClick}
      >
        <Image
          src={`/categories/${category.image}` || '/no-image.svg'}
          alt={category.name}
          height={60}
          width={60}
          quality={90}
          priority={true}
          className="h-12 w-12 object-cover sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12"
        />
        <h3 className="group-hover:text-primary line-clamp-1 text-center text-xs font-medium sm:text-sm lg:text-base">
          {category.name}
        </h3>
      </CardContent>
    </Card>
  )
}

export default CategoryCard
