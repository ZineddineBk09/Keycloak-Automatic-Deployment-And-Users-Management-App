'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons'
import { Checkbox } from '../ui/checkbox'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { KeycloakUser } from '../../interfaces'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import { useState } from 'react'
import { updateUser } from '../../lib/api'
import { useAuth } from '../../context/auth-context'
import { toast } from 'sonner'
import { useUsersContext } from '../../context/users'

/**example keycloak user
 * access:{manageGroupMembership: true, view: true, mapRoles: true, impersonate: false, manage: true}
createdTimestamp:1711547824257,
disableableCredentialTypes:[],
email:"aberzen4@telegraph.co.uk",
emailVerified:true,
enabled:false,
firstName:"Adelind",
id:"95a3f795-0192-49e2-bdb1-731fe1fdccff",
lastName:"Berzen",
notBefore:0,
requiredActions:['UPDATE_PASSWORD'],
totp:false,
username:"aberzen4",
  
 */

export const columns: ColumnDef<KeycloakUser>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'createdTimestamp',
    header: 'Created',
    cell: ({ row }) => {
      const createdTimestamp: number = row.getValue('createdTimestamp')
      const day = new Date(createdTimestamp).toLocaleDateString()
      const time = new Date(createdTimestamp).toLocaleTimeString()
      return day + ' ' + time
    },
  },
  {
    accessorKey: 'username',
    header: 'Username',
  },
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'emailVerified',
    header: 'Email Verified',
    cell: ({ row }) => {
      const emailVerified = row.getValue('emailVerified')

      return emailVerified ? (
        <CheckCircledIcon className='h-6 w-6 text-green-500' />
      ) : (
        <CrossCircledIcon className='h-6 w-6 text-red-500' />
      )
    },
  },
  {
    accessorKey: 'enabled',
    header: 'Enabled',
    cell: ({ row }) => {
      const enabled = row.getValue('enabled')

      return enabled ? (
        <CheckCircledIcon className='h-6 w-6 text-green-500' />
      ) : (
        <CrossCircledIcon className='h-6 w-6 text-red-500' />
      )
    },
  },
  {
    accessorKey: 'totp',
    header: 'TOTP',
    cell: ({ row }) => {
      const enabled = row.getValue('totp')

      return enabled ? (
        <CheckCircledIcon className='h-6 w-6 text-green-500' />
      ) : (
        <CrossCircledIcon className='h-6 w-6 text-red-500' />
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const user = row.original
      const { deleteRow, updateRow } = table.options.meta as any

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild={true}>
              <DetailsDialog user={user} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild={true}>
              <DeleteDialog
                user={user}
                deleteUserRow={(user: KeycloakUser) => {
                  // delete user
                  console.log('delete')
                  deleteRow(user)
                }}
              />
            </DropdownMenuItem>
            <DropdownMenuItem asChild={true}>
              <EditDialog user={user} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

function EditDialog({ user }: { user: KeycloakUser }) {
  const { session } = useAuth()
  const { fetchUsers } = useUsersContext()

  const [fields, setFields] = useState({
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  })

  const handleUpdate = async () => {
    console.log('update')
    await updateUser(fields, user.id, session.access_token || '')
      .then(() => {
        toast.success('User updated successfully')
        fetchUsers()
      })
      .catch((error) => {
        toast.error('Error updating user')
        console.error(error)
      })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className='relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-slate-100 hover:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50'>
          Edit
        </span>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[550px]'>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to user here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          {['username', 'firstName', 'lastName', 'email'].map((field) => {
            return (
              <div className='grid grid-cols-4 items-center gap-4' key={field}>
                <Label htmlFor={field} className='text-right'>
                  {field}
                </Label>
                <Input
                  id={field}
                  // @ts-ignore
                  defaultValue={fields[field]}
                  onChange={(event) => {
                    setFields((prev: any) => ({
                      ...prev,
                      [field]: event.target.value,
                    }))
                  }}
                  className='col-span-3'
                />
              </div>
            )
          })}
        </div>
        <DialogFooter className=''>
          <DialogClose>
            <Button variant='outline'>Close</Button>
          </DialogClose>
          <Button type='submit' onClick={handleUpdate}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeleteDialog({
  user,
  deleteUserRow,
}: {
  user: KeycloakUser
  deleteUserRow: (user: KeycloakUser) => void
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span className='relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-slate-100 hover:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50'>
          Delete
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteUserRow(user)
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

/**User example interface 
 * KeycloakUser {
  id: string
  createdTimestamp: number
  username: string
  enabled: boolean
  totp: boolean
  emailVerified: boolean
  firstName: string
  lastName: string
  email: string
  disableableCredentialTypes: string[]
  requiredActions: string[]
  notBefore: number
  access: {
    manageGroupMembership: boolean
    view: boolean
    mapRoles: boolean
    impersonate: boolean
    manage: boolean
  }
}

 * 
*/

import JSONPretty from 'react-json-pretty'

function DetailsDialog({ user }: { user: KeycloakUser }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className='relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-slate-100 hover:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50'>
          View
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User details</DialogTitle>
          <DialogDescription>
            View user details here. Click close when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div>
          <JSONPretty data={user} />
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
