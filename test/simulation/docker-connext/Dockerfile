FROM node:12-alpine3.11

RUN apk add --no-cache git bash python3 make g++ python

WORKDIR /app

RUN git clone https://github.com/connext/rest-api-client.git
RUN cd rest-api-client && git pull
RUN cd rest-api-client && git checkout 0ae160790faa6b5bc6b33114d726e1a3eb2fcfa3
RUN cd rest-api-client && npm install && npm run build
