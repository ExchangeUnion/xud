FROM golang:1.11

# btcd executable file is expected to be found in $PATH
ENV PATH="/btcd-vol/go/bin:${PATH}"

# use gomod dependencies download
ENV GOPATH="/gomod-vol/go"

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
COPY . .

RUN cd temp && cd xud && . $NVM_DIR/nvm.sh && npm i
