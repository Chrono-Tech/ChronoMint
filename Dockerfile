FROM node:7.9-slim
ARG NODE=production
ENV NODE_ENV ${NODE}
RUN apt-get update -qq && \
    apt-get install -y build-essential python && \
    mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN cd /usr/src/app && \
    git clone https://github.com/ChronoBank/ChronoMint.git
#COPY . /usr/src/app
RUN npm rebuild node-sass --force
EXPOSE 3000
CMD yarn start
