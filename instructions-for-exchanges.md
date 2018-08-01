# Instructions for Exchanges

This document is written for exchange admins and users for an easy deployment of the Exchange Union Daemon (`xud`) via Docker. This folder uses `docker-compose` to package `xud`, `mysql`, `lnd` & `btcd` together to make deploying these services as easy as typing a few commands. All configuration between `xud`, `mysql` and other containers are handled
automatically by their `docker-compose` config file.

The goal of this is that `docker-compose` to be able to lauch `xud` along with its dependencies.

## Prerequisites
* docker-compose 
* docker 

## Install
```bash
git clone https://github.com/ExchangeUnion/xud
```

```bash
Start Containers:
cd ~/xud/docker
docker-compose up -d
```
Above command should create and launch both `xud` and other required containers as per `docker-compose.yml`

Stopping Containers:
```bash
docker-compose stop
```

Removing Containers:
```bash
docker-compose down
```

* How to see `xud` | `mysql` logs?
```bash
docker-compose logs <xud|db>
```

## Code Documentation

[Read the TypeDoc here](https://exchangeunion.github.io/xud-typedoc/).

## Questions?
[![Gitter chat](https://img.shields.io/badge/chat-on%20gitter-rose.svg)](https://gitter.im/exchangeunion/Lobby)