'use client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { updateUserSchema } from '@/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from 'next-auth'
import Image from 'next/image'
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { CameraIcon, Loader2Icon, UploadIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { uploadImageAction } from '@/lib/imageUploader'
import { InputPassword } from '@/components/auth/InputPassword'
import { updateUserAction } from '@/actions/auth'

type FormData = z.infer<typeof updateUserSchema>

const ProfileForm = ({
  user,
}: {
  user:
    | (User & {
        contact: string
        bio: string
      })
    | undefined
}) => {
  const { update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const form = useForm<FormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      image: user?.image || '',
      contact: user?.contact || '',
      bio: user?.bio || '',
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
  })
  const watchedImage = form.watch('image')
  const onSubmit = (values: FormData) => {
    startTransition(async () => {
      const response = await updateUserAction(values)
      if (!response.success) {
        toast.error(response.message, {
          style: { color: 'red' },
        })
      }
      if (response?.success) {
        update()
        toast.success(response?.message, {
          style: { color: 'green' },
        })
        form.resetField('password')
        form.resetField('currentPassword')
        form.resetField('confirmPassword')
        router.refresh()
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={
                      'relative aspect-square h-56 cursor-pointer rounded-full border'
                    }
                    htmlFor="image"
                  >
                    {loading ? (
                      <div className="flex h-full w-full flex-col items-center justify-center">
                        <Loader2Icon className="animate-spin" />
                      </div>
                    ) : watchedImage ? (
                      <>
                        <Image
                          src={watchedImage || ''}
                          alt="profile image"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="border-primary bg-primary/10 rounded-full border object-cover"
                        />
                        <div className="border-primary bg-background text-accent absolute right-0 bottom-5 z-20 rounded-full border p-2">
                          <CameraIcon size={32} />
                        </div>
                      </>
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center">
                        <UploadIcon className="mb-2 h-4 w-4" />
                        Upload Photo
                      </div>
                    )}
                  </FormLabel>
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
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-inherit">
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder="eg: Hari Bahadur Shrestha"
                    className="border-accent"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-inherit">Email</FormLabel>
                <FormControl>
                  <Input
                    disabled
                    {...field}
                    placeholder="eg: hari@example.com"
                    className="border-accent"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                name="currentPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-inherit">
                      Current Password
                    </FormLabel>
                    <FormControl>
                      <InputPassword
                        disabled={isPending}
                        {...field}
                        placeholder="Current Password"
                        className="border-accent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-inherit">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <InputPassword
                        disabled={isPending}
                        {...field}
                        placeholder="New Password"
                        className="border-accent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base text-inherit">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <InputPassword
                        disabled={isPending}
                        {...field}
                        placeholder="Confirm Password"
                        className="border-accent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="contact"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-inherit">Phone</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    {...field}
                    placeholder="eg: 1234567890"
                    className="border-accent"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-inherit">Bio</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={isPending}
                    placeholder="eg: Describe yourself.."
                    className="border-accent h-40 resize-none"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button className="mt-8 cursor-pointer">
          {isPending ? <Loader2Icon className="mr-2 animate-spin" /> : ''}
          Update Profile
        </Button>
      </form>
    </Form>
  )
}

export default ProfileForm
