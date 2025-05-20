'use client'
import { resetPasswordSchema } from '@/schema'
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
import { Button } from '@/components/ui/button'
import { InputPassword } from './InputPassword'
import { Loader2Icon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { resetPasswordAction } from '@/actions/auth'
import { toast } from 'sonner'

type FormData = z.infer<typeof resetPasswordSchema>

const ResetPasswordForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const [isPending, startTransition] = useTransition()
  const form = useForm<FormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      confirmPassword: '',
      password: '',
    },
  })
  const onSubmit = (values: FormData) => {
    startTransition(async () => {
      const response = await resetPasswordAction(values, token)

      if (response?.success) {
        toast.success(response.message, {
          style: { color: 'green' },
        })
        router.push('/login')
        router.refresh()
      } else {
        toast.error(response.message, {
          style: { color: 'red' },
        })
      }
    })
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          {/* name */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name} className="text-base">
                  Password
                </FormLabel>
                <FormControl>
                  <InputPassword
                    disabled={isPending}
                    {...field}
                    placeholder="*******"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name} className="text-base">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <InputPassword
                    disabled={isPending}
                    {...field}
                    placeholder="*******"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="mt-8 w-full" size={'lg'}>
          {isPending ? (
            <Loader2Icon className="mx-2 h-5 w-5 animate-spin" />
          ) : (
            ''
          )}
          Reset Password
        </Button>
      </form>
    </Form>
  )
}

export default ResetPasswordForm
