FROM node:8

WORKDIR /opt

# Install Deps
RUN apt update && apt install -y rsync
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
ENTRYPOINT ["npm","run","run"]
