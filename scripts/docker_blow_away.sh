#!/bin/bash
docker rm $(docker ps -a -f status=exited -q)
docker rm -f $(docker ps -a -q)
docker rm -f $(docker ps -a -q)
docker system prune -a
docker images purge
docker rmi $(docker images -a -q)
docker volume prune
