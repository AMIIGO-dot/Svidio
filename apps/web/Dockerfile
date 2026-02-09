FROM node:20-alpine AS base
WORKDIR /app

FROM base AS web-deps
COPY package.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY packages/video-core/package.json ./packages/video-core/
COPY packages/ui/package.json ./packages/ui/
RUN npm install --workspace=apps/web

FROM base AS web-build
COPY --from=web-deps /app .
COPY tsconfig.base.json ./
COPY packages/types ./packages/types
COPY packages/video-core ./packages/video-core
COPY packages/ui ./packages/ui
COPY apps/web ./apps/web
RUN npm run build -w packages/types && npm run build -w apps/web

FROM base AS web
COPY --from=web-build /app/apps/web/.next/standalone ./
COPY --from=web-build /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=web-build /app/apps/web/public ./apps/web/public
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
