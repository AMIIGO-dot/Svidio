FROM node:20-alpine AS base
WORKDIR /app

FROM base AS api-deps
COPY package.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/video-core/package.json ./packages/video-core/
RUN npm install --workspace=apps/api

FROM base AS api
COPY --from=api-deps /app .
COPY tsconfig.base.json ./
COPY packages/types ./packages/types
COPY packages/video-core ./packages/video-core
COPY apps/api ./apps/api
RUN cd packages/types && npm run build
RUN cd packages/video-core && npm run build
RUN cd apps/api && npm run build
EXPOSE 4000
CMD ["node", "apps/api/dist/index.js"]
