# this step just fetch node_modules, do not launch this step
FROM node:18.18.2-alpine3.18 AS deps
WORKDIR /app
COPY package.json .
RUN npm i

# this step start the project with ts-node-dev, with dev dependencies (ts) and livereload
FROM node:18.18.2-alpine3.18 AS dev
WORKDIR /app
COPY package.json .
COPY --from=deps /app/node_modules node_modules 
COPY src src
COPY tsconfig.json tsconfig.json
CMD npm start

# this step only compile the app (ts to js), do not launch this step
FROM node:18.18.2-alpine3.18 AS build
WORKDIR /app
COPY package.json .
COPY --from=deps /app/node_modules node_modules 
COPY . .
RUN npm run build

# this step launch the app in a prod mode, with only js files and useful deps
FROM node:18.18.2-alpine3.18 AS prod
WORKDIR /app
COPY --from=deps /app/node_modules node_modules
COPY --from=build /app/dist dist
COPY --from=build /app/package.json .
RUN npm install --only=production
CMD node dist/index.js