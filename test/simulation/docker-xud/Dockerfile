FROM golang:1.11

# install node LTS version via nvm
ENV NVM_DIR /usr/local/nvm
WORKDIR $NVM_DIR
RUN curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install --lts \
    && nvm alias default lts/* \
    && nvm use default

ENV WD=/app
WORKDIR $WD

# copy xud and install dependencies
COPY xud ./xud
RUN . $NVM_DIR/nvm.sh && cd xud && npm i

# copy custom-xud and use xud's installed dependencies
COPY custom-xud ./custom-xud
RUN cp -R ./xud/node_modules ./custom-xud/node_modules



