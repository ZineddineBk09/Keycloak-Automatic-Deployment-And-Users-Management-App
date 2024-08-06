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
import { KeycloakClient } from '../../interfaces'
import DeleteDialog from '../shared/dialogs/delete'
import DetailsDialog from '../shared/dialogs/details'

export const columns: ColumnDef<KeycloakClient>[] = [
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
    accessorKey: 'clientId',
    header: 'Client ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
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
    accessorKey: 'bearerOnly',
    header: 'Bearer Only',
    cell: ({ row }) => {
      const bearerOnly = row.getValue('bearerOnly')

      return bearerOnly ? (
        <CheckCircledIcon className='h-6 w-6 text-green-500' />
      ) : (
        <CrossCircledIcon className='h-6 w-6 text-red-500' />
      )
    },
  },
  {
    accessorKey: 'serviceAccountsEnabled',
    header: 'Service Accounts',
    cell: ({ row }) => {
      const serviceAccountsEnabled = row.getValue('serviceAccountsEnabled')

      return serviceAccountsEnabled ? (
        <CheckCircledIcon className='h-6 w-6 text-green-500' />
      ) : (
        <CrossCircledIcon className='h-6 w-6 text-red-500' />
      )
    },
  },
  {
    accessorKey: 'publicClient',
    header: 'Public Client',
    cell: ({ row }) => {
      const publicClient = row.getValue('publicClient')

      return publicClient ? (
        <CheckCircledIcon className='h-6 w-6 text-green-500' />
      ) : (
        <CrossCircledIcon className='h-6 w-6 text-red-500' />
      )
    },
  },
  {
    accessorKey: 'protocol',
    header: 'Protocol',
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const client = row.original
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
              onClick={() =>
                navigator.clipboard.writeText(client?.clientId ?? client.id)
              }
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild={true}>
              <DetailsDialog data={client} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild={true}>
              <DeleteDialog
                data={client}
                deleteRow={(client: KeycloakClient) => {
                  deleteRow(client)
                }}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
