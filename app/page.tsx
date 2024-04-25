'use client'
import Link from 'next/link'
import { UsersContextProvider } from '../context/csv'
import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import Image from 'next/image'

// select between: Keycloak users management, automated keycloak deployment

export default function MainPage() {
  const cards = [
    {
      title: 'Keycloak Users Management',
      description: 'Manage users in Keycloak with ease.',
      link: '/users',
      cta: 'Manage Users',
    },
    {
      title: 'Automated Keycloak Deployment',
      description:
        'Automate your Keycloak deployment, deploy Keycloak with a single click.',
      link: '/deploy',
      cta: 'Deploy Keycloak',
    },
  ]
  return (
    <UsersContextProvider>
      <div className='container mx-auto py-10'>
        <div className='flex items-center gap-x-2'>
          <Image
            src='/images/keycloak.png'
            alt='Keycloak'
            width={150}
            height={50}
          />
          <h1 className='text-3xl font-bold'>
            Keycloak Users Management and Automated Deployment
          </h1>
        </div>

        <div className='relative w-full items-center justify-center'>
          <div className='w-full'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {cards.map((card, index) => (
                <div
                  key={index}
                  className='bg-white dark:bg-gray-950 rounded-lg shadow-lg p-6 flex flex-col items-start justify-between hover:shadow-xl transition-shadow duration-300 ease-in-out'
                >
                  <div>
                    <h2 className='text-2xl font-bold mb-2'>{card.title}</h2>
                    <p className='text-gray-500 dark:text-gray-400 mb-4'>
                      {card.description}
                    </p>
                  </div>
                  <Link
                    className='inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300'
                    href={card.link}
                    target='_blank'
                  >
                    {card.cta} <ArrowTopRightIcon className='ml-2' />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </UsersContextProvider>
  )
}
