# Start with a Node.js base image that meets Vite 7 requirements
FROM node:22-slim AS base

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy lockfile and package.json
COPY package.json pnpm-lock.yaml ./

# Install dependencies
# Using --no-frozen-lockfile to be more resilient during development
RUN pnpm install --no-frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the application
RUN pnpm run build

# Production image
FROM node:22-slim AS runner
WORKDIR /app

# Install pnpm and corepack
RUN corepack enable

# Copy built assets and necessary files for migration
COPY --from=base /app/.output ./.output
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/drizzle ./drizzle
COPY --from=base /app/src ./src
COPY --from=base /app/tsconfig.json ./tsconfig.json

# Expose the port
EXPOSE 3000

# Run migration and then start the server
# Using shell form to support the && operator
CMD pnpm db:migrate:deploy && node .output/server/index.mjs
