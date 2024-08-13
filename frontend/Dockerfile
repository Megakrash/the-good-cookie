# this step just fetch node_modules, do not launch this step
FROM node:18.18.2-alpine3.18 as deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# this step start the project with ts-node-dev, with dev dependencies (ts) and livereload
FROM node:18.18.2-alpine3.18 AS dev
WORKDIR /app
COPY package.json package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules 
COPY . .
CMD ["npm", "run", "dev"]

# this step only compile the app (ts to js), do not launch this step
FROM node:18.18.2-alpine3.18 AS build
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_MIDDLEWARE_URL
ARG NEXT_PUBLIC_PATH_IMAGE
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ARG NEXT_PUBLIC_RELEASE_TAG
WORKDIR /app
COPY package.json package-lock.json ./
COPY --from=deps /app/node_modules ./node_modules 
COPY tsconfig.json ./
COPY .eslintrc.json ./
COPY next.config.js ./
COPY public ./public
COPY src ./src
RUN npm run build

# this step launch the app in a prod mode, with only js files and useful deps
FROM node:18.18.2-alpine3.18 AS prod
WORKDIR /app
COPY --from=build /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY public ./public
RUN npm ci --omit=dev
CMD ["npm", "start"]