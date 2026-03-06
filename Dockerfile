FROM node:lts-alpine
ENV NODE_ENV=development
RUN corepack enable
WORKDIR /usr/src/app
COPY ["package.json", "pnpm-lock.yaml", "./"]
RUN pnpm install
COPY . .
RUN pnpx prisma generate
