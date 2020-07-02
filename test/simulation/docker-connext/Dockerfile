FROM node:12-alpine3.11

RUN apk add --no-cache git bash python3 make g++ python

WORKDIR /app

RUN git clone https://github.com/connext/rest-api-client.git
RUN cd rest-api-client && git pull
RUN cd rest-api-client && git checkout 64dd1eceba441297f4c31f3389f3910a453d550c
RUN cd rest-api-client && npm install && npm run build
