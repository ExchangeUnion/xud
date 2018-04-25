FROM node:8

WORKDIR /opt/xud
RUN mkdir logs

# Install Deps
RUN npm install -g gulp nodemon
COPY package*.json ./
RUN npm install

# Copy code
COPY . .

# Expose P2P & RPC ports
EXPOSE 8885 
EXPOSE 8886

#RUN it as Node user rather than root
USER node

# Create .xud directory for config volume flexibility
WORKDIR $HOME/.xud

#Switchback to main dir
WORKDIR /opt/xud

# Start Exchange Union Daemon
ENTRYPOINT ["bin/xud"]
