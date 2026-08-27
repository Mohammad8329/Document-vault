# Use the official Bun image
FROM oven/bun:1 as base
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Generate Prisma Client
RUN bunx prisma generate

# Expose the GraphQL Yoga port
EXPOSE 4000

# Run the application
CMD ["bun", "run", "dev"]
