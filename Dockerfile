FROM node:20-alpine

WORKDIR /usr/app

COPY . .

RUN yarn install

RUN yarn build

EXPOSE 80

CMD [ "yarn", "start" ]
