FROM node:7.9-slim
ARG NODE=production
ENV NODE_ENV ${NODE}
RUN apt-get update -qq && \
    apt-get install -y build-essential python && \
    mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN export NODE_ENV=production && \
    npm rebuild node-sass --force
EXPOSE 3000
CMD yarn start
