import * as React from 'react'
import type { StepperProps } from './types'
import { Flavor, Keypair, Network, Server } from '../../../interfaces/openstack'
import { getOpenstackAuthToken } from '../../../lib/api/openstack'
import { useCookies } from 'react-cookie'

interface StepperContextValue extends StepperProps {
  clickable?: boolean
  isError?: boolean
  isLoading?: boolean
  isVertical?: boolean
  stepCount?: number
  expandVerticalSteps?: boolean
  activeStep: number
  initialStep: number
  flavors: Flavor[]
  keyPairs: Keypair[]
  networks: Network[]
}

type StepperContextProviderProps = {
  value: Omit<StepperContextValue, 'activeStep'>
  children: React.ReactNode
}

const StepperContext = React.createContext<
  StepperContextValue & {
    nextStep: () => void
    prevStep: () => void
    resetSteps: () => void
    setStep: (step: number) => void
  }
>({
  steps: [],
  activeStep: 0,
  initialStep: 0,
  flavors: [],
  keyPairs: [],
  networks: [],
  nextStep: () => {},
  prevStep: () => {},
  resetSteps: () => {},
  setStep: () => {},
})

const StepperProvider = ({ value, children }: StepperContextProviderProps) => {
  const [flavors, setFlavors] = React.useState<Flavor[]>([] as Flavor[])
  const [keyPairs, setKeypairs] = React.useState<Keypair[]>([] as Keypair[])
  const [networks, setNetworks] = React.useState<Network[]>([] as Network[])
  const [cookies, setCookie, removeCookie] = useCookies([
    'openstack_auth_token',
    'current_step',
  ])

  const isError = value.state === 'error'
  const isLoading = value.state === 'loading'

  const [activeStep, setActiveStep] = React.useState(value.initialStep)

  const nextStep = () => {
    setActiveStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setActiveStep((prev) => prev - 1)
    setCookie('current_step', activeStep - 1)
  }

  const resetSteps = () => {
    setActiveStep(value.initialStep)
  }

  const setStep = (step: number) => {
    setActiveStep(step)
  }

  // fetch flavors, keypairs, and networks from /api/openstack
  React.useEffect(() => {
    const xAuthToken = getOpenstackAuthToken()
    if (!xAuthToken || xAuthToken === 'undefined') {
      setStep(0)
      return
    }

    const fetchData = async (url: string, setter: any) => {
      const response = await fetch(`/api/openstack/${url}`, {
        headers: {
          'X-Auth-Token': xAuthToken,
        },
      })
      const { data } = await response.json()
      url === 'flavors'
        ? setter(data as Flavor[])
        : url === 'keypairs'
        ? setter(data as Keypair[])
        : setter(data as Network[])
    }

    flavors.length == 0 && fetchData('flavors', setFlavors)
    keyPairs.length == 0 && fetchData('keypairs', setKeypairs)
    networks.length == 0 && fetchData('networks', setNetworks)
  }, [cookies?.openstack_auth_token])

  return (
    <StepperContext.Provider
      value={{
        ...value,
        isError,
        isLoading,
        activeStep,
        flavors,
        keyPairs,
        networks,
        nextStep,
        prevStep,
        resetSteps,
        setStep,
      }}
    >
      {children}
    </StepperContext.Provider>
  )
}

export { StepperContext, StepperProvider }
