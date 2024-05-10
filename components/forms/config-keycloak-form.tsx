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
import StepButtons from '../shared/stepper/step-buttons'
import { useStepper } from '../shared/stepper'

const formSchema = z.object({
  realmName: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
})

const ConfigureKeycloakForm = () => {
  const { flavors, keyPairs, networks, nextStep, setStep } = useStepper()
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
    console.log(values)
    // send a post request with values to /api/openstack/config
    // const response = await fetch('/api/openstack/config', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(values),
    // })
    nextStep()
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
