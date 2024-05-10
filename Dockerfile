# Use a lightweight image for Node.js applications
FROM node:18-alpine as builder

# Set working directory
WORKDIR /my-app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies and clean up
RUN npm ci

# Copy the rest of your project code
COPY . .

# Build the project
RUN npm run build

FROM node:18-alpine
WORKDIR /my-app
COPY --from=builder /my-app/package*.json ./
COPY --from=builder /my-app/next.config.mjs ./
COPY --from=builder /my-app/public ./public
RUN rm -rf ./public/example-keycloak-config.json
RUN rm -rf ./public/mini-example.json
COPY --from=builder /my-app/.next/standalone ./
COPY --from=builder /my-app/.next/static ./server


# Expose the port
EXPOSE 3000

# Entrypoint script allows passing arguments to npm start
CMD [ "npm", "start" ]
