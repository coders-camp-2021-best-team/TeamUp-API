FROM node:16-alpine AS dependencies

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

FROM node:16-alpine AS build

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN yarn build

FROM node:16-alpine AS production

WORKDIR /app

ENV NODE_ENV production

COPY --from=build /app /app

EXPOSE 3000

CMD ["yarn", "start"]

FROM node:16-alpine AS development

WORKDIR /app

ENV NODE_ENV development

COPY --from=build /app /app

EXPOSE 3000

EXPOSE 9229

CMD ["yarn", "start:dev"]