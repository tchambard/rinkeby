#!/bin/sh

docker_run="docker run"
docker_run="$docker_run -e TZ=Europe/Paris"
docker_run="$docker_run -d -p $INPUT_PORT:8545 trufflesuite/ganache-cli:$INPUT_TRUFFLE_VERSION"

sh -c "$docker_run"
