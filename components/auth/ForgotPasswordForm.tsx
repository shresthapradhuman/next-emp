'use client'
import { forgotPasswordSchema } from '@/schema'
import React, { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { forgotPasswordAction } from '@/actions/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2Icon } from 'lucide-react'

type FormData = z.infer<typeof forgotPasswordSchema>

const ForgotPasswordForm = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const form = useForm<FormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })
  const onSubmit = (values: FormData) => {
    startTransition(async () => {
      const response = await forgotPasswordAction(values)
      if (!response.success)
        toast.error(response.message, {
          style: { color: 'red' },
        })
      if (response?.success) {
        toast.success(response.message, {
          style: { color: 'green' },
        })
        router.push('/')
        router.refresh()
      }
    })
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          {/* email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name} className="text-base">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    disabled={isPending}
                    placeholder="eg: hari@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="mt-8 w-full cursor-pointer" size={'lg'}>
          {isPending ? (
            <Loader2Icon className="mx-2 h-5 w-5 animate-spin" />
          ) : (
            ''
          )}
          Send Reset Email
        </Button>
      </form>
    </Form>
  )
}

export default ForgotPasswordForm
