FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
RUN apk update
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="${PATH}:${PNPM_HOME}"
RUN npm install --global pnpm
RUN pnpm i -g turbo

FROM base AS builder
WORKDIR /app
COPY . .
RUN turbo prune --scope=auth --docker

FROM base AS installer
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/full/ .
RUN pnpm install --ignore-scripts
COPY turbo.json turbo.json

FROM installer AS runner
WORKDIR /app
# RUN addgroup --system --gid 1001 expressjs
# RUN adduser --system --uid 1001 expressjs
# USER expressjs
COPY --from=installer /app .
RUN pnpm run build --filter auth...
RUN pnpm prune --prod

CMD node services/auth/dist/index.js

# Set working directory
# WORKDIR /app
# RUN npm i -g pnpm
# RUN mkdir -p ~/.pnpm/store
# ENV PNPM_HOME ~/.pnpm/store
# ENV PATH="$PNPM_HOME/bin:$PATH"
# RUN echo $PATH
# RUN pnpm setup
# RUN pnpm i -g turbo
# COPY . .
# RUN turbo prune --scope=auth --docker

# # Add lockfile and package.json's of isolated subworkspace
# FROM base AS installer
# RUN apk add --no-cache libc6-compat
# RUN apk update
# WORKDIR /app

# # First install dependencies (as they change less often)
# COPY .gitignore .gitignore
# COPY --from=builder /app/out/json/ .
# COPY --from=builder /app/out/yarn.lock ./yarn.lock
# RUN yarn install

# # Build the project and its dependencies
# COPY --from=builder /app/out/full/ .
# COPY turbo.json turbo.json

# # Uncomment and use build args to enable remote caching
# # ARG TURBO_TEAM
# # ENV TURBO_TEAM=$TURBO_TEAM

# # ARG TURBO_TOKEN
# # ENV TURBO_TOKEN=$TURBO_TOKEN

# RUN yarn turbo run build --filter=auth...

# FROM base AS runner
# WORKDIR /app

# # Don't run production as root
# RUN addgroup --system --gid 1001 expressjs
# RUN adduser --system --uid 1001 expressjs
# USER expressjs
# COPY --from=installer /app .

# CMD node apps/auth/dist/index.js

