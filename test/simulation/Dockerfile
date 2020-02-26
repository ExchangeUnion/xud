FROM golang:1.11

# install rsync, needed for compilation of custom xud nodes
RUN apt-get update && apt-get -y install rsync

# btcd executable file is expected to be found in $PATH
ENV PATH="/btcd-vol/go/bin:${PATH}"

# use gomod dependencies download
ENV GOPATH="/gomod-vol/go"

ENV WD=/app
WORKDIR $WD

# copy the test code
COPY . .

# run the container cmd after doing source on nvm.sh (in order to get `node` executable on $PATH)
ENV NVM_DIR /nvm-vol
ENTRYPOINT ["/bin/bash", "-c", ". $NVM_DIR/nvm.sh && \"$@\"", "-s"]
