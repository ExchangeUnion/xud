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

# install rsync, needed for compilation of custom xud nodes
RUN apt-get update && apt-get -y install rsync

ENV WD=/app
WORKDIR $WD

COPY . .

# run npm install
RUN cd temp/xud && . $NVM_DIR/nvm.sh && npm i

# run the container cmd after doing source on nvm.sh (in order to get `node` executable on $PATH)
ENTRYPOINT ["/bin/bash", "-c", ". $NVM_DIR/nvm.sh && \"$@\"", "-s"]
