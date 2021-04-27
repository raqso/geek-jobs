# GeekJobs

[![Build Status](https://travis-ci.org/raqso/geek-jobs.svg?branch=master)](https://travis-ci.org/raqso/geek-jobs)

Multisite IT Job searcher
[GeekJobs.pl](http://GeekJobs.pl)

![carbon](https://user-images.githubusercontent.com/13930984/48865164-043e3900-edcf-11e8-8fa9-68bb04048eef.png)

## How to start

### Docker(quick) way

Requirements:

- [docker](https://docs.docker.com/get-docker/) installed

1. `docker-compose up`

### Regular way

Requirements:

- [node.js](https://nodejs.org/en/) installed
- [ts-node](https://www.npmjs.com/package/ts-node) package

1. `yarn` - install dependencies
2. `docker-compose up` - start database container
3. `yarn dev` - start frontend dev and api servers

Then web app should be available under [http://localhost:3000/](http://localhost:3000/)

## To run scrapping script and fill your local databse with some data

### Docker

`docker-compose exec backend yarn download`

**OR**

### Without docker

`yarn download`

## Used technologies

- [TypeScript](https://www.typescriptlang.org/)
- [Nodejs](https://nodejs.org/en/)
- [Puppeteer](https://developers.google.com/web/tools/puppeteer/)
- [MongoDB](https://www.mongodb.com/)
- [ReactJS](https://reactjs.org/)
- [webpack](https://webpack.js.org/)
