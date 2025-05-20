'use client'
import { loginSchema } from '@/schema'
import React, { Suspense, useTransition } from 'react'
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
import { InputPassword } from './InputPassword'
import Link from 'next/link'
import { Loader2Icon } from 'lucide-react'
import { loginAction } from '@/actions/auth'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

type FormData = z.infer<typeof loginSchema>

const LoginContent = () => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const form = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const onSubmit = (values: FormData) => {
    startTransition(async () => {
      const response = await loginAction(values, callbackUrl!)
      if (!response?.success) {
        toast.error(response?.message, {
          style: { color: 'red' },
        })
        form.resetField('password')
      } else {
        router.push('/profile')
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
          {/* password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor={field.name}
                  className="flex items-center justify-between text-base"
                >
                  <span>Password</span>
                  <Link
                    className="text-muted-foreground text-xs hover:underline"
                    href={'/forgot-password'}
                  >
                    Forgot Password?
                  </Link>
                </FormLabel>
                <FormControl>
                  <InputPassword {...field} placeholder="*******" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="mt-8 w-full cursor-pointer" size={'lg'}>
          {isPending ? (
            <Loader2Icon className="mx-1 h-5 w-5 animate-spin" />
          ) : (
            ''
          )}{' '}
          Login
        </Button>
      </form>
    </Form>
  )
}

export default function LoginForm() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
