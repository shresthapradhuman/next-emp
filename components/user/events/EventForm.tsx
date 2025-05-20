'use client'
import React, { useState, useTransition } from 'react'
import { eventSchema } from '@/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { CameraIcon, Loader, Loader2Icon } from 'lucide-react'
import TimePicker from '@/components/TimePicker'
import { toast } from 'sonner'
import { DatePicker } from '@/components/DatePicker'

import Image from 'next/image'
import { uploadImageAction } from '@/lib/imageUploader'
import { createEventAction, updateEventAction } from '@/actions/event'
import { Category, Event } from '@prisma/client'

type FormData = z.infer<typeof eventSchema>

const EventForm = ({
  event,
  categories,
}: {
  event?: Event
  categories: Category[]
}) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const form = useForm<FormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || '',
      status: event?.status || 'Draft',
      capacity: event?.capacity || '',
      description: event?.description || '',
      date: event?.date || new Date(),
      startTime: event?.startTime || '',
      endTime: event?.endTime || '',
      venue: event?.venue || '',
      price: event?.price || '',
      image: event?.image || '',
      categoryId: event?.categoryId || '',
    },
  })
  const watchedImage = form.watch('image')
  const onSubmit = (values: FormData) => {
    // Show immediate feedback
    const toastId = toast.loading(
      event ? 'Updating event...' : 'Creating event...',
    )

    startTransition(async () => {
      try {
        // Start navigation early
        if (event) {
          router.prefetch('/user/events')
        }

        const response = event
          ? await updateEventAction(event.id, values)
          : await createEventAction(values)

        if (response?.success) {
          toast.success(response.message, {
            id: toastId,
            style: { color: 'green' },
          })
          // Navigate after success
          router.push('/user/events')
          // Refresh in background
          router.refresh()
        } else {
          toast.error(response?.message || 'Operation failed', {
            id: toastId,
            style: { color: 'red' },
          })
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'An error occurred'
        toast.error(errorMessage, {
          id: toastId,
          style: { color: 'red' },
        })
      }
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    const result = await uploadImageAction('users', formData)
    setLoading(false)
    if (result.url) {
      form.setValue('image', result.url)
    } else {
      toast.error(result.error, {
        style: { color: 'red' },
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="pt-4 pb-10">
        <Card className="mb-4 py-4">
          <CardHeader>
            <CardTitle>Event Information</CardTitle>
            <CardDescription>
              Enter the basic information about your event
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* title */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor={field.name}
                      className="text-base text-inherit"
                    >
                      Name your event
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="capitalize"
                        id={field.name}
                        placeholder="Enter event title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* category and status */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel
                          htmlFor={field.name}
                          className="text-base text-inherit"
                        >
                          Choose Event Category
                        </FormLabel>
                      </div>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor={field.name}
                        className="text-base text-inherit"
                      >
                        Current Event Status
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Published">Published</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* date */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel
                        htmlFor={field.name}
                        className="text-base text-inherit"
                      >
                        Date
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor={field.name}
                        className="text-base text-inherit"
                      >
                        Start Time
                      </FormLabel>
                      <FormControl>
                        <TimePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor={field.name}
                        className="text-base text-inherit"
                      >
                        End Time
                      </FormLabel>
                      <FormControl>
                        <TimePicker
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* location */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="venue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor={field.name}
                        className="text-base text-inherit"
                      >
                        Venue
                      </FormLabel>
                      <FormControl>
                        <Input
                          id={field.name}
                          placeholder="Enter event venue"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor={field.name}
                        className="text-base text-inherit"
                      >
                        Capacity
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="capitalize"
                          id={field.name}
                          placeholder="People Number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor={field.name}
                        className="text-base text-inherit"
                      >
                        Ticket Price
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          {/* Currency unit */}
                          <span className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500">
                            ¥
                          </span>
                          <Input
                            id={field.name}
                            placeholder="1,000"
                            className="pl-8"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* description */}
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor={field.name}
                      className="text-base text-inherit"
                    >
                      Tell me about your event
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        id={field.name}
                        placeholder="Enter event description"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Event Image</CardTitle>
            <CardDescription>Upload an image for your event.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="image"
                    className="bg-accent flex w-full cursor-pointer items-center justify-center rounded border p-4"
                  >
                    <CameraIcon />
                    <p className="text-light-100 text-base">Upload a File</p>
                  </FormLabel>
                  <div>
                    {loading ? (
                      <div className="flex h-full w-[300] items-center justify-center">
                        <Loader2Icon className="mr-2 animate-spin" />
                        Uploading...
                      </div>
                    ) : watchedImage ? (
                      <Image
                        src={watchedImage}
                        alt="user-image"
                        width={300}
                        height={300}
                        priority
                        className="h-[400px] w-full object-cover"
                      />
                    ) : (
                      ''
                    )}
                  </div>
                  <FormControl>
                    <Input
                      accept="image/*"
                      hidden
                      id="image"
                      type="file"
                      name={field.name}
                      onBlur={field.onBlur}
                      onChange={handleFileChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="flex justify-start gap-4">
          <Button className="cursor-pointer" disabled={isPending}>
            {isPending && <Loader className="mr-1 h-5 w-5 animate-spin" />}
            {isPending
              ? event
                ? 'Updating Event'
                : 'Creating Event'
              : event
                ? 'Update Event'
                : 'Create Event'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default EventForm
