FROM node:16.7-alpine AS build

RUN npm install -g pnpm

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Start production image build
# TODO: fix
FROM node:16.13.0 AS sveltekit-docker

RUN npm install -g pnpm
COPY --from=build svelte.config.js ./svelte.config.js
COPY --from=build tsconfig.json ./tsconfig.json
COPY --from=build package.json ./package.json
COPY --from=build /app/build-node .
RUN pnpm build

EXPOSE 3000
CMD ["node", "build"]