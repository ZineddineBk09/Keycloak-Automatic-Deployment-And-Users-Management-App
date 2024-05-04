# Functionalities:

- [ ] Automatic keycloak deployment from our app to OpenStack:
  
  - [ ] Openstack Access:
    - [ ] Openstack credentials (API key, username, project name, domain name, region)
  
  - [ ] OpenStack VM:
    - [ ] Machine name
    - [ ] Machine description
    - [ ] Disk space & RAM & VCPUs
    - [ ] Network (port, network, security group)
    - [ ] ...etc
  
  - [ ] Keycloak:
    - [ ] Admin credentials
    - [ ] Realm name (default master)
    - [ ] Clients (clientId, name, auth type(OpenID, SAML), redirect URI)

  - [ ] Storage of configuration: 
    - [ ] Gitlab to track the configuration of the keycloak instances generated
      - [ ] Deploy Gitlab on the VM
      - [ ] Create a repository for the configuration of each realm
      - [ ] Each configuration should have it's unique branch (realm name - date)

    - [ ] Sqlite Database:
      - [ ] Store the coniguration of the keycloak instances


# Steps:

1. Create VM with OpenStack Nova API with the informations the user provided.
2. Use Heat to deploy Keycloak on the VM.
3. Use Keycloak API to create the realm and clients.
4. Return the URL of the Keycloak instance to the user.
5. The user can now access the Keycloak instance and use it.
