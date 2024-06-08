# Use a lightweight image for Node.js applications
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the source code
COPY . .

# Generate the Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Use a lightweight image for the production environment
FROM node:18-alpine AS production

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install only the production dependencies
RUN npm install --only=production

# Copy the build files from the previous stage
COPY --from=build /app/.next ./.next

# Copy the public and static folders from the build stage
COPY --from=build /app/public ./public
COPY --from=build /app/.next/static ./.next/static

# Prisma
COPY --from=build /app/prisma ./prisma

# Move the copied public, and static folders to the .next/standalone folder
RUN mv public .next/standalone/public && mv .next/static .next/standalone/.next/

ENV DATABASE_URL='postgres://xxxx:xxxx@xxxx:5432/xxxx'

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
