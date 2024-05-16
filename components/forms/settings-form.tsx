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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Input } from '../ui/input'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useCookies } from 'react-cookie'
import { ClientSession, DecodedJWT } from '../../interfaces'
import { getClient } from '../../lib/api/keycloak'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

const formSchema = z.object({
  clientId: z
    .string({
      required_error: 'Please enter a client ID',
    })
    .min(1),
  realmId: z
    .string({
      required_error: 'Please enter a realm ID',
    })
    .min(1),
  authProtocol: z
    .string({
      required_error: 'Please enter an authentication protocol',
    })
    .min(1),
  adminUser: z
    .string({
      required_error: 'Please enter an admin user',
    })
    .min(1),
  serverUrl: z
    .string({
      required_error: 'Please enter a server URL',
    })
    .min(1),
})

interface FieldType {
  id: string
  name: string
  placeholder: string
  type: 'input' | 'select'
  options: { value: string; label: string }[]
}

export function ClientSettingsForm() {
  const router = useRouter()
  const [cookies, setCookie, removeCookie] = useCookies(['kc_session'])
  const [decoded, setDecoded] = useState<DecodedJWT>({} as DecodedJWT)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: '',
      realmId: 'master',
      authProtocol: 'openid-connect',
      adminUser: 'admin',
      serverUrl: 'https://keycloak.example.com:8080',
    },
  })

  const fields: FieldType[] = [
    {
      id: 'clientId',
      name: 'Client ID',
      type: 'input',
      options: [],
      placeholder: 'The public identifier for your client.',
    },
    {
      id: 'realmId',
      name: 'Realm',
      type: 'input',
      options: [],
      placeholder: 'The realm identifier.',
    },
    {
      id: 'authProtocol',
      name: 'Authentication Protocol',
      type: 'select',
      options: [
        { value: 'openid-connect', label: 'OpenID Connect' },
        { value: 'saml', label: 'SAML' },
      ],
      placeholder:
        'The authentication protocol. e.g. openid-connect, saml, etc.',
    },
    {
      id: 'adminUser',
      name: 'Admin User',
      type: 'input',
      options: [],
      placeholder: 'The admin user. e.g. admin, root, etc.',
    },
    {
      id: 'serverUrl',
      name: 'Server URL',
      type: 'input',
      options: [],
      placeholder: 'The Keycloak server URL.',
    },
  ]

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // send a patch request with values to /api/client?clientId=clientId
    const response = await fetch(`/api/client?clientId=${decoded.client_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...values,
        // trim serverUrl to remove trailing slash
        serverUrl: values?.serverUrl.replace(/\/$/, ''),
      }),
    })

    if (response.ok) {
      const { data }: { data: ClientSession } = await response.json()

      toast.success('Client settings updated successfully!')
    } else {
      const { data } = await response.json()
      const msg =
        typeof data === 'string' ? data : data?.message || 'Unknown error'
      toast.error('Failed to register: ' + msg)
    }
  }

  useEffect(() => {
    if (!decoded.client_id) return
    getClient(decoded.client_id as string).then(({ data }: any) => {
      const { client } = data
      if (!client) return
      form.setValue('clientId', client.clientId)
      form.setValue('realmId', client.realmId)
      form.setValue('authProtocol', client.authProtocol)
      form.setValue('adminUser', client.adminUser)
      form.setValue('serverUrl', client.serverUrl)
    })
  }, [decoded])

  useEffect(() => {
    const token = cookies?.kc_session
    if (token) {
      try {
        const decoded: DecodedJWT = jwtDecode(token)
        setDecoded(decoded)
      } catch (err) {
        toast.error('Failed to decode token')
      }
    }
  }, [])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
        {fields.map(({ id, name, placeholder, type, options }: FieldType) => (
          <FormField
            key={id}
            control={form.control}
            // @ts-ignore
            name={id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{name}</FormLabel>
                {type === 'input' ? (
                  <FormControl>
                    <Input placeholder={name} {...field} />
                  </FormControl>
                ) : (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select an option' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {options.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FormDescription>{placeholder}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button
          type='submit'
          // disabled if form is invalid and the form is submitting and no form values have changed
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          Submit
        </Button>
      </form>
    </Form>
  )
}
