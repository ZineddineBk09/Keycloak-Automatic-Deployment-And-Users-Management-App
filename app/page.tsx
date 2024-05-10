'use client'
import { UsersContextProvider } from '../context/csv'
import Image from 'next/image'
import MainCard from '../components/shared/cards'

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
    link: '/start-deploy',
    cta: 'Deploy Keycloak',
  },
]

export default function MainPage() {
  return (
    <UsersContextProvider>
      <div className='container mx-auto'>
        <div className='flex items-center gap-x-2'>
          <Image
            src='/images/keycloak.png'
            alt='Keycloak'
            width={100}
            height={40}
          />
          <h1 className='text-xl font-bold'>
            Keycloak Users Management and Automated Deployment
          </h1>
        </div>

        <div className='relative w-full items-center justify-center'>
          <div className='w-full'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {cards.map((card, index) => (
                <MainCard card={card} key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </UsersContextProvider>
  )
}
