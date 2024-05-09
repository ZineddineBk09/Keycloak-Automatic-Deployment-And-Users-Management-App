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
import StepButtons from '../shared/stepper/step-buttons'

const formSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  project: z.string().min(1),
  domain: z.string().min(1).default('Default'),
})

const DeployKeycloakForm = () => {
  const { flavors, keyPairs, networks, nextStep, setStep } = useStepper()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      project: '',
      domain: 'Default',
    },
  })

  const formFields: FieldType[] = [
    {
      id: 'username',
      name: 'Username',
      placeholder: 'The username for your Openstack account.',
    },
    {
      id: 'password',
      name: 'Password',
      placeholder: 'The password for your Openstack account.',
    },
    {
      id: 'project',
      name: 'Project',
      placeholder: 'The project for your Openstack account.',
    },
    {
      id: 'domain',
      name: 'Domain',
      placeholder: 'The domain for your Openstack account.',
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
            Openstack API Access
          </h2>
          <p className='text-gray-500 text-sm dark:text-gray-400 mb-4'>
            Set up Openstack API Access (Username, Password, Project, Domain)
          </p>
        </div>

        {/* Form */}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='w-full space-y-3'
          >
            {formFields.map(({ id, name, placeholder }: FieldType) => (
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
            <StepButtons />
          </form>
        </Form>
      </div>
    </div>
  )
}

export default DeployKeycloakForm
