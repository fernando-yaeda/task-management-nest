## Description

Task Management API built with NestJS

## Installation

```bash
$ npm install
```

## Setting up the environment

```bash
# create environment variable files
$ cp .env.example .env

# create the docker network
$ docker network create triangle-network

# start the container
$ docker compose up
```

- enter pgAdmin web with the credentials setted on docker-compose.yml file and create the server and database
- the server hostname/address must be the same as the postgresql service, instead of localhost since we are using docker


## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Stay in touch

- Author - [Fernando Yaeda](https://github.com/fernando-yaeda)

## License

Nest is [MIT licensed](LICENSE).
# task-management-next
