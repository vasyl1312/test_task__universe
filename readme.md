# Test Universe

[Requirement](./requirement.yaml)
[Swagger](./swagger.yaml)

### Description:

`Business requirements:`

- get current bitcoin (BTC) rate in hryvnia (UAH)
- subscribe email to receive information about the change in the exchange rate
- send current rate to all subscribed users

`Technical details:`

    - service application:
        - unsubscribe email flow
        - get all emails both subscribed and unsubscribed flow with statuses
        - send metrics to prometheus flow:
            - subscribe email count
            - unsubscribe email count
            - send email count
            - send email error count
            - exchange rate gauge
        - get prometheus metrics flow
    - worker application:
        - scrape metrics by worker
        - store to metrics table

`Tech stack:`

    - ExpressJS
    - TypeScript
    - PostgreSQL
    - DrizzleORM
    - SendGrid
    - Prometheus

<!-- - Docker -->

## Prerequisites

This project requires NodeJS (version 8 or later) and NPM.
[Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are really easy to install.
To make sure you have them available on your machine,
try running the following command.

```sh
$ npm -v && node -v
8.17.0
v18.18.0
```

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Installation

Start with cloning this repo on your local machine:

```sh
$ git clone https://github.com/ORG/PROJECT.git
$ cd PROJECT
```

For Windows users in packege.json:

```sh
  "scripts": {
      "start": "set NODE_PATH=./dist && node ./dist/index.js",
      "dev": "nodemon",
      "build": "del /S /Q dist && tsc -p tsconfig.json",
      "prod": "npm run build && npm run start"
    },
```

To install run:

```sh
$ npm install
```

## Usage

### Serving the app and building a distribution version

```sh
$ npm run build
```

This task will create a distribution version of the project
inside your local `dist/` folder

    After this, project opens at http://localhost:7000 If not, just open a new tab in your browser and paste there

http://localhost:7000
