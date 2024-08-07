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
import DeleteDialog from '../shared/dialogs/delete'
import DetailsDialog from '../shared/dialogs/details'
import EditDialog from './dialogs/edit'
import ResetPasswordDialog from './dialogs/reset-password'

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
      const { deleteRow } = table.options.meta as any

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='z-0'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild={true}>
              <DetailsDialog data={user} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild={true}>
              <DeleteDialog
                data={user}
                deleteRow={(data: any) => {
                  deleteRow(user as KeycloakUser)
                }}
              />
            </DropdownMenuItem>
            <DropdownMenuItem asChild={true}>
              <EditDialog user={user} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild={true}>
              <ResetPasswordDialog userId={user?.id} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
