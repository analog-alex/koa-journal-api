# Journal API

A [Koa](https://koajs.com/) based back-end written with **TypeScript** to support a journal. Uses **MongoDB** as a data store.


![Node.js CI](https://github.com/analog-alex/koa-journal-api/workflows/Node.js%20CI/badge.svg)

## How to launch locally

Something like 😀️:
- clone repo
- run `docker-compose up -d mongo`
- fill the `.env` file following the `.env.example`
- launch with `npm start`

Requires **npm** and **docker**. Though it can also use a normal **MongoDB** instance as long as the connection url is valid.
