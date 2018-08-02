# Instructions for Exchanges & Users

This document contains `xud` setup instructions for exchange admins and technical users utilizing Docker.

We use `docker-compose` to package `xud`, `mysql`, `lnd`, `btcd`, `ltcd`, `raiden` & `geth` together to make deploying these services as easy as typing a few commands. All configuration between `xud`, `mysql` and other containers are handled automatically by their `docker-compose` config file.

The goal of this is `docker-compose` being able to lauch `xud` along with its dependencies.

## 1. Prerequisites
* docker
* docker-compose

To install these on e.g. Ubuntu, check the [official docker install instructions](https://docs.docker.com/install/linux/docker-ce/ubuntu/).
```

## 2. Install
```bash
git clone https://github.com/ExchangeUnion/xud -b 1.0.0-prealpha
```

### 3. Run

Start Containers:

```bash
cd ~/xud/docker
docker-compose up -d
```
Above command should create and launch both `xud` and other required containers as per `docker-compose.yml`. It will take a moment until everything is downloaded for the first time.

Stop Containers:
```bash
docker-compose stop
```

Remove Containers:
```bash
docker-compose down
```

Check `xud` | `mysql` logs:
```bash
docker-compose logs <xud|db>
```

## Code Documentation

Read the [TypeDoc here](https://exchangeunion.github.io/xud-typedoc/).

## Development & Testing Discussion

[![Gitter chat](https://img.shields.io/badge/chat-on%20gitter-rose.svg)](https://gitter.im/exchangeunion/Lobby)