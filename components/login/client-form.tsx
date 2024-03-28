'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth'

const formSchema = z.object({
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
})

export function ClientForm() {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: '',
      clientSecret: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await signIn({
      clientId: values.clientId,
      clientSecret: values.clientSecret,
    }).then((res: { ok: boolean; status: number } | any) => {
      if (res.ok && res.status == 200) {
        router.push('/dashboard')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='clientId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client ID</FormLabel>
              <FormControl>
                <Input placeholder='client identifier' {...field} />
              </FormControl>
              <FormDescription>
                This is the public identifier for your client.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='clientSecret'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Secret</FormLabel>
              <FormControl>
                <Input placeholder='********' {...field} />
              </FormControl>
              <FormDescription>
                This is the secret key for your client.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  )
}
