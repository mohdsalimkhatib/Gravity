#!/bin/zsh

cd ~/Documents/Gravity || exit 1

echo "Current working dir: $(pwd)"

echo "Executing $0"

if [[ "$1" == "start" ]]; then
	echo "starting docker containers" :
        docker compose up --build
elif [[ "$1" == "stop" ]]; then
	echo "stop docker containers"
        docker compose down
else
	echo "Invalid option"
fi
