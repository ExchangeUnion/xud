FROM node:8.11.3

# Install Golang & gRPC deps
RUN apt-get update && apt-get install -y --no-install-recommends \
		g++ \
		gcc \
		libc6-dev \
		make \
		pkg-config \
	&& rm -rf /var/lib/apt/lists/*
ADD https://dl.google.com/go/go1.10.3.linux-amd64.tar.gz .
RUN tar -C /usr/local -xzf go1.10.3.linux-amd64.tar.gz 
RUN rm go1.10.3.linux-amd64.tar.gz
ENV PATH="/usr/local/go/bin:$PATH"
ENV GOPATH /go
ENV PATH $GOPATH/bin:/usr/local/go/bin:$PATH
RUN mkdir -p "$GOPATH/src" "$GOPATH/bin" && chmod -R 777 "$GOPATH"
RUN go get -u github.com/grpc-ecosystem/grpc-gateway/protoc-gen-swagger
RUN go get -u github.com/pseudomuto/protoc-gen-doc/cmd/protoc-gen-doc

WORKDIR /opt

# Install Deps
RUN apt-get update && apt-get install -y rsync
RUN npm install -g gulp nodemon typescript --quiet
RUN git clone https://github.com/ExchangeUnion/xud
WORKDIR /opt/xud
RUN npm install --quiet

# Expose P2P & RPC ports
EXPOSE 8885 
EXPOSE 8886

# Compile TypeScript to JS
RUN npm run compile

# Create .xud directory for config volume flexibility
WORKDIR $HOME/.xud
COPY xud.conf xud.conf

#Switchback to main dir
WORKDIR /opt/xud

# Start Exchange Union Daemon
ENTRYPOINT ["npm","start"]
