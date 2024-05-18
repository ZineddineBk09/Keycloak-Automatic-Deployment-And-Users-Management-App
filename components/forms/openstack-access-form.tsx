import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FieldType } from '../../interfaces'
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
import { useStepper } from '../shared/stepper'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import StepButtons from '../shared/stepper/step-buttons'
import { toast } from 'sonner'

const formSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  project: z.string().min(1),
  domain: z.string().min(1).default('Default'),
  baseUrl: z
    .string()
    .min(1)
    .regex(
      /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
    )
    .default('https://api.openstack.com'),
})

const OpenstackAccessForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      project: '',
      domain: 'Default',
      baseUrl: 'https://api.openstack.com',
    },
  })
  const { nextStep, setStep } = useStepper()
  const [cookies, setCookie, removeCookie] = useCookies([
    'openstack_auth_token',
    'openstack_user_id',
    'current_step',
  ])

  const formFields: FieldType[] = [
    {
      id: 'username',
      name: 'Username',
      placeholder: 'The username for your Openstack account.',
      type: 'text',
    },
    {
      id: 'password',
      name: 'Password',
      placeholder: 'The password for your Openstack account.',
      type: 'password',
    },
    {
      id: 'project',
      name: 'Project',
      placeholder: 'The project for your Openstack account.',
      type: 'text',
    },
    {
      id: 'domain',
      name: 'Domain',
      placeholder: 'The domain for your Openstack account.',
      type: 'text',
    },
    {
      id: 'baseUrl',
      name: 'Base URL',
      placeholder: 'The base URL for your Openstack account.',
      type: 'text',
    },
  ]

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // use axios instead of fetch to access the reponse headers and get X-Subject-Token
      const response = await axios.post('/api/openstack/auth', {
        username: values?.username,
        password: values?.password,
        project: values?.project,
        domain: values?.domain,
        baseUrl: values?.baseUrl,
      })

      if (response.status === 200) {
        if (!response.headers['x-subject-token']) {
          toast.error('Missing token in response headers')
          return
        }

        // save cookies
        setCookie('openstack_auth_token', response.headers['x-subject-token'], {
          path: '/',
          maxAge: 3600, // 1 hour
        })
        setCookie('openstack_user_id', response?.data?.data?.token?.user?.id, {
          path: '/',
          maxAge: 3600, // 1 hour
        })
        setCookie('current_step', 1, {
          path: '/',
          maxAge: 3600, // 1 hour
        })

        toast.success('Openstack API Access granted successfully')

        // move to the next step
        nextStep()
      } else {
        toast.error('Invalid credentials')
      }
    } catch (error) {
      console.log(error)
      toast.error('An error occured!')
    }
  }

  // check if the user is authenticated and skip the step
  if (
    cookies?.openstack_auth_token &&
    cookies?.openstack_auth_token !== 'undefined' &&
    cookies?.current_step
  ) {
    setStep(cookies?.current_step)
  }

  return (
    <div className='container mx-auto overflow-x-hidden'>
      <div className='w-full py-5  flex flex-col items-start justify-between'>
        <div>
          <h2 className='flex items-center text-xl font-bold mb-1'>
            Openstack API Access
          </h2>
          <p className='text-gray-500 text-sm dark:text-gray-400 mb-4'>
            Set up The Openstack API Access
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-full space-y-3'
          >
            {formFields.map(({ id, name, placeholder, type }: FieldType) => (
              <FormField
                key={id}
                control={form.control}
                // @ts-ignore
                name={id}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{name}</FormLabel>
                    <FormControl>
                      <Input placeholder={name} {...field} type={type} />
                    </FormControl>
                    <FormDescription>{placeholder}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <StepButtons />
          </form>
        </Form>
      </div>
    </div>
  )
}

export default OpenstackAccessForm
