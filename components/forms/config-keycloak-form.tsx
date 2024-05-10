import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
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
import StepButtons from '../shared/stepper/step-buttons'
import { useStepper } from '../shared/stepper'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { toast } from 'sonner'
import { OpenstackConfig } from '../../interfaces/openstack'

const formSchema = z.object({
  realmName: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
})

const ConfigureKeycloakForm = () => {
  const { nextStep, setStep } = useStepper()
  const [cookies, setCookie, removeCookie] = useCookies([
    'openstack_auth_token',
    'openstack_user_id',
    'current_step',
  ])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      realmName: 'master',
      username: 'admin',
      password: '',
    },
  })

  const formFields: FieldType[] = [
    {
      id: 'realmName',
      name: 'Realm Name',
      placeholder: 'The realm name for your Keycloak server.',
    },
    {
      id: 'username',
      name: 'Username',
      placeholder: 'The username for your Keycloak admin account.',
    },
    {
      id: 'password',
      name: 'Password',
      placeholder: 'The password for your Keycloak admin account.',
      type: 'password',
    },
  ]

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // use axios instead of fetch to access the reponse headers and get X-Subject-Token
      const response = await axios.post('/api/openstack/config-keycloak', {
        realmName: values.realmName,
        username: values.username,
        password: values.password,
        userId: cookies.openstack_user_id || '',
      })

      if (response.status === 200) {
        toast.success('Keycloak Configured Successfully!')
        console.log(response)
        setCookie('current_step', 3)
        // move to the next step
        nextStep()
      } else {
        toast.error('Error Configuring Keycloak!')
      }
    } catch (error) {
      console.log(error)
      toast.error('An error occured!')
    }
  }

  // check if user already configured realnm, username, and password before
  useEffect(() => {
    const getData = async () => {
      await fetch('/api/openstack', {
        headers: {
          userId: cookies.openstack_user_id as string,
        },
      })
        .then(async (res) => await res.json())
        .then(({ data }: { data: OpenstackConfig }) => {
          if (data.adminUsername && data.adminPassword && data.realmName) {
            form.setValue('realmName', data.realmName)
            form.setValue('username', data.adminUsername)
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }
    getData()
  }, [])

  if (
    cookies.openstack_auth_token &&
    cookies.openstack_auth_token !== 'undefined' &&
    cookies.current_step
  ) {
    setStep(cookies.current_step)
  }

  return (
    <div className='container mx-auto overflow-x-hidden'>
      <div className='w-full py-5  flex flex-col items-start justify-between'>
        <div>
          <h2 className='flex items-center text-xl font-bold mb-1'>
            Keycloak Configuration
          </h2>
          <p className='text-gray-500 text-sm dark:text-gray-400 mb-4'>
            Set up Keycloak.
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

export default ConfigureKeycloakForm
