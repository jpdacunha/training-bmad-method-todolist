# ---- Base ----
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# ---- Dependencies ----
FROM base AS dependencies
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/
RUN pnpm install --frozen-lockfile || pnpm install

# ---- Development ----
FROM dependencies AS development
COPY tsconfig.base.json ./
COPY packages/shared/ ./packages/shared/
COPY apps/web/ ./apps/web/
WORKDIR /app/apps/web
EXPOSE 5173
CMD ["pnpm", "dev", "--host", "0.0.0.0"]

# ---- Build ----
FROM dependencies AS build
COPY tsconfig.base.json ./
COPY packages/shared/ ./packages/shared/
COPY apps/web/ ./apps/web/
WORKDIR /app/apps/web
RUN pnpm build

# ---- Production ----
FROM nginx:alpine AS production
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
