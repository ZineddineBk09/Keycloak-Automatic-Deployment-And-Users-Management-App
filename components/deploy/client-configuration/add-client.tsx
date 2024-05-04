'use client'

import { Button } from '../../ui/button'
import { KeycloakClient } from '../../../interfaces'
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
import { toast } from 'sonner'
import { PlusIcon } from '@radix-ui/react-icons'
import { useKeycloakConfigurationContext } from '../../../context/keycloak-config'
import { useState } from 'react'

/**{
    "clientId": "test", // ADD TO FORM
    "name": "", // ADD TO FORM
    "description": "", // ADD TO FORM
    "rootUrl": "",
    "adminUrl": "",
    "baseUrl": "",
    "surrogateAuthRequired": false,
    "enabled": true,
    "alwaysDisplayInConsole": false,
    "clientAuthenticatorType": "client-secret",
    "redirectUris": [
      "/*"
    ],
    "webOrigins": [
      "/*"
    ],
    "notBefore": 0,
    "bearerOnly": false,
    "consentRequired": false,
    "standardFlowEnabled": true,
    "implicitFlowEnabled": false,
    "directAccessGrantsEnabled": true,
    "serviceAccountsEnabled": false,
    "publicClient": true,
    "frontchannelLogout": true,
    "protocol": "openid-connect",
    "attributes": {
      "oidc.ciba.grant.enabled": "false",
      "oauth2.device.authorization.grant.enabled": "false",
      "backchannel.logout.session.required": "true",
      "backchannel.logout.revoke.offline.tokens": "false"
    },
    "authenticationFlowBindingOverrides": {},
    "fullScopeAllowed": true,
    "nodeReRegistrationTimeout": -1,
    "defaultClientScopes": [
      "web-origins",
      "acr",
      "roles",
      "profile",
      "email"
    ],
    "optionalClientScopes": [
      "address",
      "phone",
      "offline_access",
      "microprofile-jwt"
    ],
    "access": {
      "view": true,
      "configure": false,
      "manage": false
    }
  }
 */

function AddClient() {
  const { config, setConfig } = useKeycloakConfigurationContext()
  const [client, setClient] = useState({
    clientId: '',
    name: '',
    description: '',
  })
  const handleAddClient = () => {
    setConfig({
      ...config,
      clients: [
        ...config.clients,
        {
          clientId: client.clientId,
          name: client.name,
          description: client.description,
          rootUrl: '',
          adminUrl: '',
          baseUrl: '',
          surrogateAuthRequired: false,
          enabled: true,
          alwaysDisplayInConsole: false,
          clientAuthenticatorType: 'client-secret',
          redirectUris: ['/*'],
          webOrigins: ['/*'],
          notBefore: 0,
          bearerOnly: false,
          consentRequired: false,
          standardFlowEnabled: true,
          implicitFlowEnabled: false,
          directAccessGrantsEnabled: true,
          serviceAccountsEnabled: false,
          publicClient: true,
          frontchannelLogout: true,
          protocol: 'openid-connect',
          attributes: {
            'oidc.ciba.grant.enabled': 'false',
            'oauth2.device.authorization.grant.enabled': 'false',
            'backchannel.logout.session.required': 'true',
            'backchannel.logout.revoke.offline.tokens': 'false',
          },
          authenticationFlowBindingOverrides: {},
          fullScopeAllowed: true,
          nodeReRegistrationTimeout: -1,
          defaultClientScopes: [
            'web-origins',
            'acr',
            'roles',
            'profile',
            'email',
          ],
          optionalClientScopes: [
            'address',
            'phone',
            'offline_access',
            'microprofile-jwt',
          ],
          access: {
            view: true,
            configure: false,
            manage: false,
          },
        },
      ],
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='ml-auto'>
          Add Client
          <PlusIcon className='h-5 w-5 text-gray-500 ml-2' aria-hidden='true' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[550px]'>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to client here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          {[
            { label: 'Client ID', id: 'clientId' },
            { label: 'Name', id: 'name' },
            { label: 'Description', id: 'description' },
          ].map((field) => {
            return (
              <div
                className='grid grid-cols-4 items-center gap-4'
                key={field.id}
              >
                <Label htmlFor={field.id} className='text-right'>
                  {field.label}
                </Label>
                <Input
                  id={field.id}
                  // @ts-ignore
                  defaultValue={client[field.id]}
                  onChange={(event) => {
                    console.log({
                      ...client,
                      [field.id]: event.target.value,
                    })
                    setClient({
                      ...client,
                      [field.id]: event.target.value,
                    })
                  }}
                  disabled={field.id === 'username'}
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
          <Button
            type='submit'
            onClick={() => {
              handleAddClient()
              toast.success('Client added successfully')
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddClient
