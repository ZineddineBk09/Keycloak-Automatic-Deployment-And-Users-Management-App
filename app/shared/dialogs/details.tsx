'use client'

import { Button } from '../../../components/ui/button'
import { KeycloakClient, KeycloakUser } from '../../../interfaces'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '../../../components/ui/dialog'
import JSONPretty from 'react-json-pretty'

function DetailsDialog({ data }: { data: KeycloakUser | KeycloakClient }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className='relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-slate-100 hover:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50'>
          View
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Details</DialogTitle>
          <DialogDescription>
            View details here. Click close when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='overflow-y-auto max-h-[600px]'>
          <JSONPretty data={data} />
        </div>
        <DialogFooter>
          <DialogClose>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DetailsDialog
