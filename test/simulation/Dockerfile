FROM golang:1.11

ENV WD=/app
WORKDIR $WD

# btcd executable file is expected to be found in $PATH
ENV PATH="/btcd-vol/go/bin:${PATH}"

# use test-docker dependencies download
ENV GOPATH="/gomod-vol/go"

RUN apt-get update
RUN apt-get install -y nodejs npm
RUN curl -L https://npmjs.org/install.sh | sh

COPY . .

RUN cd temp && cd xud && npm i
WORKDIR $WD

