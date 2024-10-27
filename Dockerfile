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
COPY --from=build /app/public ./public
COPY --from=build /app/.next/static ./.next/static

# Prisma
COPY --from=build /app/prisma ./prisma

RUN mv .next/static .next/standalone/.next/
RUN mv public .next/standalone/public

# Expose the port 3000 for the app
EXPOSE 3000

# Start the application
CMD ["npm", "start"]