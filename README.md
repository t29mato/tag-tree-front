# user-front

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## By Docker

$ docker-compose up

- Nuxt.js (User Front): http://localhost:3000/
- Prism (API Mock): http://localhost:4010/

## Mock Environment

- User Front Mock: https://std3-user-front.vercel.app/
- API Mock: https://virtserver.swaggerhub.com/t29mato/std3/1.0.0
- API Docs: https://app.swaggerhub.com/apis/t29mato/std3/1.0.0

## Generate Starrydata API Client

```
$ make api-client
```
