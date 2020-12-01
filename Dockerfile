# base image (at leasty nodeJS 13)
FROM node:13-alpine

# Create app directory
WORKDIR /usr/src/app

# install dependencies
COPY package*.json ./
RUN apk update
RUN apk add g++
RUN apk add make
RUN apk add python
RUN npm install
RUN npm install typescript -g

# Bundle app source
COPY --chown=node:node . .

RUN tsc
EXPOSE 8080
CMD [ "node", "dist/index.js" ]
