FROM node:12-alpine3.11

RUN apk add --no-cache git bash python3 make g++ python

WORKDIR /app

RUN git clone https://github.com/connext/rest-api-client.git
RUN cd rest-api-client && git pull
RUN cd rest-api-client && git checkout fe1876a0411e0b9928825ae51104e16a9fd7b787
RUN cd rest-api-client && npm install && npm run build
