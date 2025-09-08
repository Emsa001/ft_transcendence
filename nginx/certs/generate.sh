#!/bin/sh
key=nginx/certs/key.pem
cert=nginx/certs/cert.pem

if [ -f "$key" ]; then
  echo "existing certificates found"
  exit
fi

openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout "$key" -out "$cert" -subj "/CN=localhost"

echo

tput bold
tput setaf 2
echo "Certificate created successfully"

tput sgr0

echo