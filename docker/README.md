This document is written for people who are eager to do something with 
the Exchange Union Daemon (`xud`). This folder uses `docker-compose` to
package `xud`, `mysql`, `lnd` & `btcd` together to make deploying these services as easy as
typing a few commands. All configuration between `xud`, `mysql` and other containers are handled
automatically by their `docker-compose` config file.

The goal of this is that `docker-compose` to be able to spin up / lauch `xud` along with its dependencies.

### Prerequisites
* docker-compose 
* docker 
  
### Table of content
 * [Create XUD](#get-xud-up-and-running)

 * [Questions](#questions)

### Get XUD up and running.

This section describes a workflow on a development/test enviroment.

Start Containers:
```bash
$ docker-compose up -d
```
Above command should create and launch both `xud` and other required containers as per the config in docker-compose.yml

Stopping Containers:
```bash
$ docker-compose stop
```

Removing Containers:
```bash
$ docker-compose down
```

### Questions
[![Gitter chat](https://img.shields.io/badge/chat-on%20gitter-rose.svg)](https://gitter.im/exchangeunion/Lobby)

* How to see `xud` | `mysql` logs?
```bash
docker-compose logs <xud|db>
```
