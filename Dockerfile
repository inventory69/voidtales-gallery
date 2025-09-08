# Stage 1: Base image for all subsequent stages, using a minimal Node.js environment
FROM node:20-alpine AS base

# Define build arguments (if needed for other purposes, but downloads are now in workflow)
ARG EXT_DL_URL_MARKDOWN
ARG EXT_DL_URL_ORIGINAL
ARG EXT_DL_URL_MARKDOWN_EXTERNAL
ARG EXT_DL_URL_ORIGINAL_EXTERNAL

# Set them as environment variables (if needed)
ENV EXT_DL_URL_MARKDOWN=$EXT_DL_URL_MARKDOWN
ENV EXT_DL_URL_ORIGINAL=$EXT_DL_URL_ORIGINAL
ENV EXT_DL_URL_MARKDOWN_EXTERNAL=$EXT_DL_URL_MARKDOWN_EXTERNAL
ENV EXT_DL_URL_ORIGINAL_EXTERNAL=$EXT_DL_URL_ORIGINAL_EXTERNAL

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Enable corepack to manage package managers like pnpm
RUN corepack enable

# ---

# Stage 2: The build stage, where we install dependencies and build the application
FROM base AS build
WORKDIR /app
# Copy all project files to the container (node_modules is excluded via .dockerignore)
COPY . .
# Copy lock files to leverage caching
COPY package.json pnpm-lock.yaml ./
# Install pnpm dependencies with --yes to skip interactive prompts
RUN pnpm install --frozen-lockfile --yes
# Set environment to production to optimize the build
ENV NODE_ENV=production
# Build the application for production (downloads are skipped since files are copied)
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