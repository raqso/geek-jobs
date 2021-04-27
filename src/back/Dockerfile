FROM node:15-alpine as base

RUN apk add --virtual udev ttf-freefont chromium git
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROMIUM_PATH /usr/bin/chromium-browser
WORKDIR /src
COPY package*.json /
COPY yarn.lock /
EXPOSE 5000

FROM base as production
ENV NODE_ENV=production
RUN yarn install --frozen-lockfile
COPY . /
CMD ["yarn", "start"]

FROM base as dev
ENV NODE_ENV=development
RUN yarn
COPY . /
CMD ["yarn", "dev"]
