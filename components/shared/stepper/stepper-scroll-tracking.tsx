import { Step, type StepItem, Stepper, useStepper } from './'
import { Button } from '../../../components/ui/button'
import OpenstackAccessForm from '../../forms/openstack-access-form'
import ConfigureServerInstanceForm from '../../forms/config-server-form'
import ConfigureKeycloakForm from '../../forms/config-keycloak-form'
import DeployKeycloakForm from '../../forms/deploy-keycloak-form'
import { useEffect } from 'react'

const steps = [
  {
    label: 'Openstack Access',
    children: <OpenstackAccessForm />,
  },
  {
    label: 'Configure Server Instance',
    children: <ConfigureServerInstanceForm />,
  },
  {
    label: 'Configure Keycloak',
    children: <ConfigureKeycloakForm />,
  },
  {
    label: 'Deploy Keycloak',
    children: <DeployKeycloakForm />,
  },
] satisfies StepItem[]

export default function StepperScrollTracking() {
  return (
    <div className='flex w-full flex-col gap-4'>
      <Stepper
        orientation='vertical'
        initialStep={0}
        steps={steps}
        scrollTracking
        // state='error'
      >
        {steps.map((stepProps, index) => {
          return (
            <Step key={stepProps.label} {...stepProps}>
              {stepProps.children}
              {/* <StepButtons /> */}
            </Step>
          )
        })}
        <FinalStep />
      </Stepper>
    </div>
  )
}

const FinalStep = () => {
  const { hasCompletedAllSteps, resetSteps } = useStepper()

  if (!hasCompletedAllSteps) {
    return null
  }

  return (
    <>
      <div className='h-40 flex items-center justify-center border bg-secondary text-primary rounded-md'>
        <h1 className='text-xl'>Woohoo! All steps completed! 🎉</h1>
      </div>
      <div className='w-full flex justify-end gap-2'>
        <Button size='sm' onClick={resetSteps}>
          Reset
        </Button>
      </div>
    </>
  )
}
