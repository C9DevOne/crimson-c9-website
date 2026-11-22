# Three stages so the shipped image carries no toolchain and no dev dependencies.
# Node pinned to the same version as .node-version and CI — a Next build that passes on one
# Node major and fails on another is a bad way to find out they drifted.
FROM node:26.13.1-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:26.13.1-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# `output: "standalone"` in next.config.ts is what makes the final stage possible.
RUN npm run build

FROM node:26.13.1-alpine
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    TZ=Europe/Berlin
# Next traces exactly the files server.js needs into .next/standalone; static assets and
# public/ are not traced and have to come along separately.
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
USER node
EXPOSE 3000
# No migrate step, unlike c9-tickets: v1 has no database (see the Payload decoupling in
# commit 2145367). When Payload returns this becomes `payload migrate && exec node server.js`.
CMD ["node", "server.js"]
