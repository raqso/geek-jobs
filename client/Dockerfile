FROM node:16-alpine as base

WORKDIR /app
COPY package*.json .
COPY yarn.lock .
EXPOSE 3000

FROM base as dev
ENV NODE_ENV=development
RUN yarn
COPY . .
CMD ["yarn", "dev"]
