'use client'

import MainCard from '../../components/shared/cards'
import { Button } from '../../components/ui/button'
import Link from 'next/link'

export default function DeploySettupPage() {
  // create status enum
  enum Status {
    NOT_STARTED = 'not-started',
    COMPLETED = 'completed',
    PENDING = 'pending',
    FAILED = 'failed',
  }

  const steps = [
    {
      title: 'Openstack API Access & Keycloak Server',
      description: 'Set up Openstack API Access',
      status: Status.NOT_STARTED,
      subSteps: [
        {
          title: 'Openstack API Access',
          description:
            'Set up Openstack API Access (Username, Password, Project, Domain)',
          status: Status.NOT_STARTED,
        },
        {
          title: 'Keycloak Server',
          description:
            'Set up Keycloak Server Instance with Openstack Nova API (Flavor, Image, Network, Security Group, ...etc)',
          status: Status.NOT_STARTED,
        },
      ],
    },
    {
      title: 'Keycloak Configuration',
      description: 'Set up Keycloak Configuration (Realm, Clients, ...etc)',
      status: Status.NOT_STARTED,
      subSteps: [
        {
          title: 'Keycloak Realm Configuration',
          description: 'Set up Keycloak Realm Configuration (Name, ...etc)',
          status: Status.NOT_STARTED,
        },
        {
          title: 'Keycloak Clients Configuration',
          description:
            'Set up Keycloak Clients Configuration (ID, Protocol ...etc)',
          status: Status.NOT_STARTED,
        },
      ],
    },
    {
      title: 'Keycloak Installation & Deployment',
      description: 'Install Keycloak',
      status: Status.NOT_STARTED,
      subSteps: [
        {
          title: 'Keycloak Installation ',
          description: 'Install Keycloak with Docker and Docker Compose',
          status: Status.NOT_STARTED,
        },
        {
          title: 'Keycloak Deployment',
          description: 'Deploy Keycloak Server with Openstack Nova API',
          status: Status.NOT_STARTED,
        },
      ],
    },
  ]

  return (
    <div className='container mx-auto py-10 overflow-x-hidden'>
      <h1 className='text-2xl font-bold mb-10'>
        Welcome to Keycloak Openstack Automatic Deployment
      </h1>

      <div className='flex flex-col items-start'>
        <div className='w-full grid grid-cols-1 gap-y-3'>
          {steps.map((step, index) => (
            <MainCard key={index} card={{ ...step, index: index + 1 }} />
          ))}
        </div>

        <Link href='/deploy' className='mt-10 mx-auto'>
          <Button>Start Deployment</Button>
        </Link>
      </div>
    </div>
  )
}
