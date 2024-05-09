'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '../ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useCookies } from 'react-cookie'
import { ClientSession, FieldType } from '../../interfaces'

const formSchema = z.object({
  clientId: z.string().min(1),
  clientSecret: z.string().min(1),
})

export function ClientLoginForm() {
  const router = useRouter()
  const [cookies, setCookie, removeCookie] = useCookies(['kc_session'])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: '',
      clientSecret: '',
    },
  })

  const fields: FieldType[] = [
    {
      id: 'clientId',
      name: 'Client ID',
      placeholder: 'The public identifier for your client.',
    },
    {
      id: 'clientSecret',
      name: 'Client Secret',
      placeholder: 'The secret key for your client.',
    },
  ]

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // send a post request with values to /api/client/login
    const response = await fetch('/api/client/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })

    if (response.ok) {
      const { data }: { data: ClientSession } = await response.json()
      
      if (!data.access_token) {
        toast.error('Failed to login: access_token not found')
        return
      }

      // save session to cookie
      setCookie('kc_session', data.access_token, {
        path: '/',
        maxAge: data.expires_in,
      })

      toast.success('Successfully logged in')
      //router.push('/users')
    } else {
      const { data } = await response.json()
      const msg =
        typeof data === 'string' ? data : data?.message || 'Unknown error'
      toast.error('Failed to login: ' + msg)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
        {fields.map(({ id, name, placeholder }: FieldType) => (
          <FormField
            key={id}
            control={form.control}
            // @ts-ignore
            name={id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{name}</FormLabel>
                <FormControl>
                  <Input placeholder={name} {...field} />
                </FormControl>
                <FormDescription>{placeholder}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  )
}
