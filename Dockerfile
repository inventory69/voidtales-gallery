# Stage 1: Base image for all subsequent stages, using a minimal Node.js environment
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Enable corepack to manage package managers like pnpm
RUN corepack enable

# ---

# Stage 2: The build stage, where we install dependencies and build the application
FROM base AS build
WORKDIR /app
# Copy all project files to the container
COPY . .
# Copy lock files to leverage caching
COPY package.json pnpm-lock.yaml ./
# Install pnpm dependencies with a cache mount for faster builds
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# Set environment to production to optimize the build
ENV NODE_ENV=production
# Build the application for production
RUN pnpm run build

# ---

# Stage 3: The deployment stage for running a Node.js server (this part seems unused based on the final image)
FROM base AS dokploy
WORKDIR /app
ENV NODE_ENV=production

# Copy only the necessary production files from the 'build' stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

# ---

# Stage 4: The final, production-ready image for serving with Nginx
FROM nginx:alpine
# Copy the built static files from the 'build' stage to the Nginx web server directory
COPY --from=build /app/dist /usr/share/nginx/html
# Nginx has a default command, so a `CMD` instruction is not required
# EXPOSE port 80 to make it accessible outside the container
EXPOSE 80
# The commented-out command is for a Node.js server, not for this Nginx image.
# CMD ["pnpm", "start"]