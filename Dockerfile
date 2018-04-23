FROM node:9

# Create .xud directory for config volume flexibility
WORKDIR ~/.xud/

WORKDIR /opt/xud

# Install Deps
RUN npm install -g gulp nodemon
COPY package*.json ./
RUN npm install

# Copy code
COPY . .

# Enviroment variables
ENV DB_HOST="db"
ENV DB_PORT=3306
ENV DB_USER="xud"
ENV DB_PASSWORD=""
ENV DB_NAME="xud"

# Expose P2P & RPC ports
EXPOSE 8885 
EXPOSE 8886

# Start Exchange Union Daemon
ENTRYPOINT ["bin/xud"] 