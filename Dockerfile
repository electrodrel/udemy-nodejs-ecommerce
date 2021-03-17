FROM node:15.11.0-alpine3.10 as builder

WORKDIR /home/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]