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
import { resetUserPassword } from '../../../lib/api/keycloak'
import { toast } from 'sonner'
import { useUsersContext } from '../../../context/users'
/**export const resetUserPassword = async (userId: string, password: string) => {
  const kcSession = getKcSession();
  const { domain, realm, admin } = await getClientDomainRealmAdminAndProtocol();

  if (!kcSession || !realm || !admin) {
    throw new Error(
      "Error resetting password. Please check if the server is running. and try again."
    );
  }

  // check if the user has the "admin" role
  const decoded = jwtDecode(kcSession) as any;
  const roles = decoded.realm_access.roles;
  if (!roles.includes("admin")) {
    console.log("You need to have the admin role to reset a user's password. Please contact your administrator.", roles)
    throw new Error(
      "You need to have the admin role to reset a user's password. Please contact your administrator."
    );
  }

  try {
    const response = await axios.put(`/${admin}/realms/${realm}/users/${userId}/reset-password`, {
      type: "password",
      temporary: false,
      value: password,
    }, {
      baseURL: domain,
      headers: {
        Authorization: `Bearer ${kcSession}`,
      },
    });
    const data = await response.data;
    return data;
  } catch (error) {
    throw error;
  }
} */
function ResetPasswordDialog({ userId }: { userId: string }) {
  const { fetchUsers, page } = useUsersContext()
  console.log(userId)
  const [password, setPassword] = useState('')

  const handleResetPassword = async () => {
    // await updateRecord('users', password, userId)
    //   .then(() => {
    //     toast.success('User updated successfully')
    //     fetchUsers(page)
    //   })
    //   .catch((error) => {
    //     toast.error('Error updating user')
    //     console.error(error)
    //   })
    //   .finally(() => {
    //     // close the dialog
    //     document.getElementById('close')?.click()
    //   })
    await resetUserPassword(userId, password).then(() => {
      toast.success('Password reset successfully')
      fetchUsers(page)
    }
    ).catch((error) => {
      toast.error(error.message ?? 'Error resetting password')
      console.error(error)
    }).finally(() => {
      document.getElementById('close')?.click()
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className='relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-slate-100 hover:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50 text-red-500'>
          Reset Password
        </span>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[550px]'>
        <DialogHeader>
          <DialogTitle>Reset Password <span className='ml-2 text-sm px-2 py-1 bg-red-100 rounded font-normal'>
            <strong className='text-red-500'>Warning:</strong> This action is
            irreversible.
          </span></DialogTitle>
          <DialogDescription>
            <span>Reset the password for the user. Click save when you&apos;re done.</span>
            <br />

          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='password' className='text-right'>
              New Password
            </Label>
            <Input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='col-span-3'
            />
          </div>
        </div>
        <DialogFooter className=''>
          <DialogClose>
            <Button variant='outline' id='close'>
              Close
            </Button>
          </DialogClose>
          <Button type='submit' onClick={handleResetPassword}
            className='bg-red-500 hover:bg-red-600 text-white'
          >
            Reset Password
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ResetPasswordDialog
