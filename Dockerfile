FROM node:16-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build


FROM node:16-alpine AS production

WORKDIR /app

COPY --from=build /app/build /app/build
COPY --from=build /app/package.json /app/yarn.lock ./
COPY --from=build /app/README.md /app/LICENSE ./

RUN yarn install --frozen-lockfile --production

CMD ["yarn", "start"]


FROM node:16-alpine AS development

WORKDIR /app

COPY --from=build /app ./

CMD ["yarn", "start:dev"]