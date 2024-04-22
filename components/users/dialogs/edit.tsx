'use client'

import { Button } from '../../ui/button'
import { KeycloakUser } from '../../../interfaces'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '../../ui/dialog'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { useState } from 'react'
import { updateRecord } from '../../../lib/api'
import { toast } from 'sonner'
import { useUsersContext } from '../../../context/users'

function EditDialog({ user }: { user: KeycloakUser }) {
  const { fetchUsers } = useUsersContext()
  const [fields, setFields] = useState({
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  })

  const handleUpdate = async () => {
    await updateRecord('users', fields, user.id)
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
                  onChange={
                    // disable onchange for username
                    field === 'username'
                      ? () => {}
                      : (event) => {
                          setFields((prev: any) => ({
                            ...prev,
                            [field]: event.target.value,
                          }))
                        }
                  }
                  disabled={field === 'username'}
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

export default EditDialog
