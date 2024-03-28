# Keycloak Users Manegement System

This is a simple project to manage users in a Keycloak server. It uses the Keycloak Admin REST API to manage users. the admin can leverage this system to mass create, update, and delete users through a simple interface and a csv file.

## Technologies

- Next.js
- React
- Tailwind CSS
- Keycloak Admin REST API
- Axios
- TypeScript

## Features

- List users
- Create user
- Create multiple users from a csv file
- Update user
- Delete user

## Screenshots

## Getting Started

**First**, run the keycloak server in a docker container in development mode:

```bash
docker run --name mykeycloak -p 8080:8080 \
                                        -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin \
                                        quay.io/keycloak/keycloak:latest \
                                        start-dev
```

then, create a client in the keycloak server with the following settings:

- Client ID: `rest-api-client`
- Enable: `Client authentication`, and select the `Service accounts roles` options
- In Web Origins, add `http://localhost:3000`

After that, go to the client `Credentials` tab, copy the secret key, and paste it in the `.env.local` file in the root of the project:

```bash
NEXT_PUBLIC_KEYCLOAK_CLIENT_SECRET=YOUR_SECRET
```

Then go to `Service accounts roles` tab, and add the following roles:

- view-users
- manage-users
- query-users

**Second**, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Keycloak REST API Documentation

[Keycloak REST API Documentation](https://www.keycloak.org/docs-api/21.0.0/rest-api/index.html)
