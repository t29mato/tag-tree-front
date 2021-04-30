# ベースイメージを指定
FROM node:16

WORKDIR /app

ENV HOST=0.0.0.0

COPY package.json /app
RUN yarn install

EXPOSE 3000

CMD ["yarn", "dev"]
