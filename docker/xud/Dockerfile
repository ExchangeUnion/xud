FROM node:8

# Create .xud directory for config volume flexibility
WORKDIR $HOME/.xud
COPY xud.conf xud.conf

WORKDIR /opt

# Install Deps
RUN apt-get update && apt-get install -y rsync
RUN npm install -g gulp nodemon typescript --quiet
RUN git clone https://github.com/ExchangeUnion/xud
WORKDIR /opt/xud
RUN npm install --quiet

# Compile TypeScript to JS
RUN npm run compile

# Expose P2P & RPC ports
EXPOSE 8885 
EXPOSE 8886

# Start Exchange Union Daemon
ENTRYPOINT ["npm", "start"]