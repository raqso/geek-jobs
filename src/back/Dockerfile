FROM node:15-alpine as base

WORKDIR /src
COPY package*.json /
COPY yarn.lock /
EXPOSE 5000

FROM base as production
ENV NODE_ENV=production
RUN yarn install --frozen-lockfile
COPY . /
CMD ["node", "bin/www"]

FROM base as dev
ENV NODE_ENV=development
RUN yarn
COPY . /
CMD ["nodemon", "bin/www"]
