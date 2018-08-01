# Instructions for Exchanges

This document contains `xud` setup instructions for exchange admins and technical users utilizing Docker.

We use `docker-compose` to package `xud`, `mysql`, `lnd`, `btcd`, `ltcd`, `raiden` & `geth` together to make deploying these services as easy as typing a few commands. All configuration between `xud`, `mysql` and other containers are handled automatically by their `docker-compose` config file.

The goal of this is `docker-compose` being able to lauch `xud` along with its dependencies.

## Prerequisites
* docker (e.g. apt install docker-compose)
* docker-compose (e.g. apt install docker-compose)

To install these on e.g. Ubuntu, run:
```bash
apt install docker
apt install docker-compose
```

## Install
```bash
git clone https://github.com/ExchangeUnion/xud/tree/1.0.0-prealpha
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

Read the [TypeDoc here](https://exchangeunion.github.io/xud-typedoc/).

## Questions?
[![Gitter chat](https://img.shields.io/badge/chat-on%20gitter-rose.svg)](https://gitter.im/exchangeunion/Lobby)