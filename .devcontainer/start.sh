#/bin/sh

yarn install
yarn dev & prism mock -d -p 8080 ./api/Starrydata-API.yaml
