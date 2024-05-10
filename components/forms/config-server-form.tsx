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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useStepper } from '../shared/stepper'
import {
  Flavor,
  Keypair,
  Network,
  OpenstackConfig,
} from '../../interfaces/openstack'
import StepButtons from '../shared/stepper/step-buttons'
import axios from 'axios'
import { useCookies } from 'react-cookie'
import { toast } from 'sonner'

const formSchema = z.object({
  flavor: z.string().min(1),
  keypair: z.string().min(1),
  network: z.string().min(1),
  port: z.string().min(1),
})

const ConfigureServerInstanceForm = () => {
  const { flavors, keyPairs, networks, nextStep, setStep } = useStepper()
  const [cookies, setCookie, removeCookie] = useCookies([
    'openstack_auth_token',
    'openstack_user_id',
    'current_step',
  ])
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      flavor: '',
      keypair: '',
      network: '',
      port: '8080',
    },
  })

  const formFields: FieldType[] = [
    {
      id: 'flavor',
      name: 'Flavor',
      placeholder: 'The flavor for your Openstack Server Instance.',
      type: 'select',
    },
    {
      id: 'keypair',
      name: 'Keypair',
      placeholder: 'The keypair for your Openstack Server Instance.',
      type: 'select',
    },
    {
      id: 'network',
      name: 'Network',
      placeholder: 'The network for your Openstack Server Instance.',
      type: 'select',
    },
    {
      id: 'port',
      name: 'Port',
      placeholder:
        'The port for your Openstack Server Instance to Run Keycloak on.',
      type: 'text',
    },
  ]

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // use axios instead of fetch to access the reponse headers and get X-Subject-Token
      const response = await axios.post('/api/openstack/config-server', {
        flavor: values.flavor,
        keypair: values.keypair,
        network: values.network,
        keycloakPort: values.port,
        xAuthToken: cookies.openstack_auth_token || '',
        userId: cookies.openstack_user_id || '',
      })

      if (response.status === 200) {
        toast.success('Keycloak Server Instance Configured Successfully!')
        console.log(response)
        setCookie('current_step', 2)
        // move to the next step
        nextStep()
      } else {
        toast.error('Error Configuring Keycloak Server Instance!')
      }
    } catch (error) {
      console.log(error)
      toast.error('An error occured!')
    }
  }

  const renderFlavor = (flavor: Flavor) => {
    const vcpus = flavor.vcpus
    const ram = flavor.ram > 1024 ? flavor.ram / 1024 + 'GB' : flavor.ram + 'MB'
    const disk = flavor.disk

    return (
      <SelectItem key={flavor.id} value={flavor.name}>
        {flavor.name}
        <span className='text-xs ml-2'>{`${vcpus}vCPU ${ram} ${disk}GB`}</span>
      </SelectItem>
    )
  }

  if (
    cookies.openstack_auth_token &&
    cookies.openstack_auth_token !== 'undefined' &&
    cookies.current_step
  ) {
    setStep(cookies.current_step)
  }

  // check if user already configured flavor, keypair, network and port before
  useEffect(() => {
    const getData = async () => {
      await fetch('/api/openstack', {
        headers: {
          userId: cookies.openstack_user_id as string,
        },
      })
        .then(async (res) => await res.json())
        .then(({ data }: { data: OpenstackConfig }) => {
          if (
            data.flavor &&
            data.keypair &&
            data.network &&
            data.keycloakPort
          ) {
            form.setValue('flavor', data.flavor)
            form.setValue('keypair', data.keypair)
            form.setValue('network', data.network)
            form.setValue('port', data.keycloakPort)
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }
    getData()
  }, [networks, flavors, keyPairs])

  return (
    <div className='container mx-auto overflow-x-hidden'>
      <div className='w-full py-5  flex flex-col items-start justify-between'>
        <div>
          <h2 className='flex items-center text-xl font-bold mb-1'>
            Configure Keycloak Server Instance
          </h2>
          <p className='text-gray-500 text-sm dark:text-gray-400 mb-4'>
            Set up Keycloak Server Nova Instance
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
                      {type == 'text' ? (
                        <Input placeholder={name} {...field} />
                      ) : (
                        <Select
                          defaultValue={field.value}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={'Select a ' + name} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {id == 'flavor' && flavors.length > 0 && (
                                <>
                                  <SelectLabel>
                                    {name} vCPU RAM Disk
                                  </SelectLabel>
                                  {flavors?.map((flavor: Flavor) =>
                                    renderFlavor(flavor)
                                  )}
                                </>
                              )}

                              {id == 'keypair' && keyPairs.length > 0 && (
                                <>
                                  <SelectLabel>{name}</SelectLabel>
                                  {keyPairs.map((keypair: Keypair) => (
                                    <SelectItem
                                      key={keypair.keypair.name}
                                      value={keypair.keypair.name}
                                    >
                                      {keypair.keypair.name}
                                    </SelectItem>
                                  ))}
                                </>
                              )}

                              {id == 'network' && networks.length > 0 && (
                                <>
                                  <SelectLabel>{name}</SelectLabel>
                                  {networks.map((network: Network) => (
                                    <SelectItem
                                      key={network.id}
                                      value={network.id}
                                    >
                                      {network.label}
                                    </SelectItem>
                                  ))}
                                </>
                              )}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
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

export default ConfigureServerInstanceForm
