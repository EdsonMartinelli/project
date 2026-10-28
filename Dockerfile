FROM node:24-slim

RUN corepack enable && corepack prepare pnpm@12.11.2 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc* .

RUN pnpm install --frozen-lockfile

COPY --exclude=package.json --exclude=pnpm-lock.yaml --exclude=pnpm-workspace.yaml --exclude=.npmrc . .

EXPOSE 3000

CMD ["pnpm", "dev"]