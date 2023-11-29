FROM node:18.18.2-alpine3.18

WORKDIR /app
COPY package.json package.json

RUN npm i

COPY tsconfig.json tsconfig.json
COPY public public
COPY src src

CMD npm start