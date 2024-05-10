# Steps for user to auto-deploy keycloak on Openstack

1. Create Openstack VM

   1. Generate an auth token (X-Auth-Token) to use the Openstack API
      Send a POST request to the Openstack Identity API to get an auth token.

      - Endpoint: ` https://dash.cloud.cerist.dz:5000/v3/auth/tokens?nocatalog`
      - Body:

      ```json
      {
        "auth": {
          "identity": {
            "methods": ["password"],
            "password": {
              "user": {
                "name": "YOUR_USERNAME",
                "domain": {
                  "name": "Default"
                },
                "password": "YOUR_PASSWORD"
              }
            }
          },
          "scope": {
            "project": {
              "name": "PROJECT_NAME",
              "domain": {
                "name": "Default"
              }
            }
          }
        }
      }
      ```

      Upon success, the response will contain the `X-Subject-Token` header which is the auth token.

   2. Create a VM (with `docker` and `docker compose` installed)
      Send a POST request to the Openstack Compute API to create a VM.

      - Endpoint: `https://dash.cloud.cerist.dz:8774/v2.1/servers`
      - Headers:
        - `X-Auth-Token`: The auth token from the previous step
        - `Content-Type`: `application/json`
      - Body:

      ```json
      {
        "server": {
          "name": "VM_NAME",
          "imageRef": "IMAGE_ID",
          "flavorRef": "FLAVOR_ID",
          "networks": [
            {
              "uuid": "NETWORK_ID"
            }
          ],
          "user_data": "IyEvYmluL2Jhc2gKL2Jpbi9zdQpmb3IgcGtnIGluIGRvY2tlci5pbyBkb2NrZXItZG9jIGRvY2tlci1jb21wb3NlIGRvY2tlci1jb21wb3NlLXYyIHBvZG1hbi1kb2NrZXIgY29udGFpbmVyZCBydW5jOyBkbyBzdWRvIGFwdC1nZXQgcmVtb3ZlICRwa2c7IGRvbmUKIyBBZGQgRG9ja2VyJ3Mgb2ZmaWNpYWwgR1BHIGtleToKc3VkbyBhcHQtZ2V0IHVwZGF0ZQpzdWRvIGFwdC1nZXQgaW5zdGFsbCBjYS1jZXJ0aWZpY2F0ZXMgY3VybApzdWRvIGluc3RhbGwgLW0gMDc1NSAtZCAvZXRjL2FwdC9rZXlyaW5ncwpzdWRvIGN1cmwgLWZzU0wgaHR0cHM6Ly9kb3dubG9hZC5kb2NrZXIuY29tL2xpbnV4L3VidW50dS9ncGcgLW8gL2V0Yy9hcHQva2V5cmluZ3MvZG9ja2VyLmFzYwpzdWRvIGNobW9kIGErciAvZXRjL2FwdC9rZXlyaW5ncy9kb2NrZXIuYXNjCgojIEFkZCB0aGUgcmVwb3NpdG9yeSB0byBBcHQgc291cmNlczoKZWNobyBcCiAgImRlYiBbYXJjaD0kKGRwa2cgLS1wcmludC1hcmNoaXRlY3R1cmUpIHNpZ25lZC1ieT0vZXRjL2FwdC9rZXlyaW5ncy9kb2NrZXIuYXNjXSBodHRwczovL2Rvd25sb2FkLmRvY2tlci5jb20vbGludXgvdWJ1bnR1IFwKICAkKC4gL2V0Yy9vcy1yZWxlYXNlICYmIGVjaG8gIiRWRVJTSU9OX0NPREVOQU1FIikgc3RhYmxlIiB8IFwKICBzdWRvIHRlZSAvZXRjL2FwdC9zb3VyY2VzLmxpc3QuZC9kb2NrZXIubGlzdCA+IC9kZXYvbnVsbApzdWRvIGFwdC1nZXQgdXBkYXRlCnN1ZG8gYXB0LWdldCBpbnN0YWxsIGRvY2tlci1jZSBkb2NrZXItY2UtY2xpIGNvbnRhaW5lcmQuaW8gZG9ja2VyLWJ1aWxkeC1wbHVnaW4gZG9ja2VyLWNvbXBvc2UtcGx1Z2lu"
        }
      }
      ```

      > [!NOTE]
      > The `user_data` field contains a base64 encoded script that will install docker and docker-compose on the VM.
      > The script is as follows:

      ```bash
        #!/bin/bash
        ## Add Docker's official GPG key:
        sudo apt-get update && sudo apt-get upgrade -y
        sudo apt-get install ca-certificates curl
        sudo install -m 0755 -d /etc/apt/keyrings
        sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
        sudo chmod a+r /etc/apt/keyrings/docker.asc

        ## Add the repository to Apt sources:
        echo \
          "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
          $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
          sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        sudo apt-get update
        sudo apt-get install fish net-tools docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
        ## Create docker compose file for keycloak deployment
        echo "version: '3'
        services:
          keycloak:
            image: quay.io/keycloak/keycloak:latest
            container_name: keycloak
            ports:
              - '8080:8080'
            environment:
              - KEYCLOAK_ADMIN=admin
              - KEYCLOAK_ADMIN_PASSWORD=admin
            command: start-dev" > /etc/os-release
        sudo docker compose -f /etc/os-release up -d
      ```

      The response will contain the VM ID.

2. Create a Heat stack that handles deploying using the heat api with the following body:

```json
{
  "files": {
    "deploy": "#!/bin/bash \n## Add Docker's official GPG key: \nsudo apt-get update && sudo apt-get upgrade -y \nsudo apt-get install ca-certificates curl \nsudo install -m 0755 -d /etc/apt/keyrings \nsudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc \nsudo chmod a+r /etc/apt/keyrings/docker.asc \n## Add the repository to Apt sources: \necho \"deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable\" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null \nsudo apt-get update \nsudo apt-get install fish net-tools docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y \n## Create docker compose file for keycloak deployment \necho \"version: '3' \nservices: \n  keycloak: \n    image: quay.io/keycloak/keycloak:latest \n    container_name: keycloak \n    ports: \n      - '8080:8080' \n    environment: \n      - KEYCLOAK_ADMIN=admin \n      - KEYCLOAK_ADMIN_PASSWORD=admin \n    command: start-dev\" > /etc/os-release \nsudo docker compose -f /etc/os-release up -d",
  },
  "disable_rollback": true,
  "parameters": {
    "flavor": "m1.small"
  },
  "stack_name": "Keycloak-Auto-Deploy-Stack",
  "template": {
    "heat_template_version": "2013-05-23",
    "description": "Simple template to test heat commands",
    "parameters": {
      "flavor": {
        "default": "m1.small",
        "type": "string"
      },
      "image": {
        "default": "925cf5db-152f-40c4-9e1a-f94847c845b3", // Ubuntu-Jammy-22.04
        "type": "string"
      }
    },
    "resources": {
      "keycloak": {
        "type": "OS::Nova::Server",
        "properties": {
          "key_name": "Test",
          "flavor": {
            "get_param": "flavor"
          },
          "image": "925cf5db-152f-40c4-9e1a-f94847c845b3",
          "user_data": {
            "get_file": "deploy"
          }
        }
      }
    }
  },
  "timeout_mins": 1
}
```

5.
