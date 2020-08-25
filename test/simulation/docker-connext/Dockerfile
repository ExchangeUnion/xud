FROM node:12-alpine3.11

RUN apk add --no-cache git bash python3 make g++ python

WORKDIR /app

# This is a "hack" to automatically invalidate the cache in case there are new commits
ADD https://api.github.com/repos/connext/rest-api-client/commits/master /dev/null
RUN git clone https://github.com/connext/rest-api-client.git
RUN cd rest-api-client && git pull
RUN cd rest-api-client && git checkout 9dafbfb914415f70a14123de9e295df175633c24
RUN cd rest-api-client && npm install && npm run build
