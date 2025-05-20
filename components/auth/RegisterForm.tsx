'use client'
import { registerSchema } from '@/schema'
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
import { InputPassword } from './InputPassword'
import { registerAction } from '@/actions/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2Icon } from 'lucide-react'

type FormData = z.infer<typeof registerSchema>

const RegisterForm = () => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const form = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })
  const onSubmit = (values: FormData) => {
    startTransition(async () => {
      const response = await registerAction(values)
      if (response?.success) {
        toast.success(response?.message, {
          style: { color: 'green' },
        })
        router.push('/')
      } else {
        toast.error(response?.message, {
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={field.name} className="text-base">
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="eg: Hari Bahadur Shrestha"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
        </div>
        <Button className="mt-8 w-full cursor-pointer" size={'lg'}>
          {isPending ? (
            <Loader2Icon className="h-5 w-5 animate-spin" />
          ) : (
            'Register'
          )}
        </Button>
      </form>
    </Form>
  )
}

export default RegisterForm
