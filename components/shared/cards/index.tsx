import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import React from 'react'

interface Step {
  title: string
  description: string
  status: string
}

interface CardProps {
  title: string
  description: string
  link?: string
  cta?: string
  status?: string
  subSteps?: Step[]
  index?: number
}

const MainCard = ({ card }: { card: CardProps }) => {
  const { title, description, link, cta, status, subSteps, index } = card

  return (
    <div className='w-full bg-white dark:bg-gray-950 rounded-lg shadow-lg p-6 flex flex-col items-start justify-between hover:shadow-xl transition-shadow duration-300 ease-in-out'>
      <div>
        <h2 className='flex items-center text-xl font-bold mb-2'>
          {index && (
            <div className='w-6 h-6 flex items-center justify-center p-1 bg-black rounded-full mr-2 text-white text-sm'>
              {index}
            </div>
          )}
          {title}
        </h2>
        <p className='text-gray-500 text-sm dark:text-gray-400 mb-4'>
          {description}
        </p>
      </div>
      {link && (
        <Link
          className='inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300'
          href={link || '/'}
          target='_blank'
        >
          {cta} <ArrowTopRightIcon className='ml-2' />
        </Link>
      )}

      {subSteps && (
        <div className='w-full grid grid-cols-1  mt-2'>
          {subSteps.map((step, index) => (
            <div
              key={index}
              className='w-full rounded-lg p-2 pl-5 flex flex-col items-start justify-between duration-300 ease-in-out'
            >
              <h2 className='flex items-center text-xl font-bold mb-2'>
                {index + 1 && (
                  <div className='w-2 h-2 bg-black rounded-full mr-2'>
                  </div>
                )}
                {step.title}
              </h2>
              <p className='text-gray-500 text-sm dark:text-gray-400 ml-8'>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MainCard
