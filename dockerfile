FROM node:18-alpine

RUN apk add bash

WORKDIR /app
COPY . .

RUN yarn install --immutable --immutable-cache --check-cache

CMD ["yarn", "start:prod"]
