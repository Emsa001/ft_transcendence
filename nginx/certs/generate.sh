#!/bin/bash

openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx/certs/key.pem -out nginx/certs/cert.pem -subj "/CN=localhost" > /dev/null 2>&1

echo

tput bold
tput setaf 2
echo "Certificates created successfully"

tput sgr0

echo