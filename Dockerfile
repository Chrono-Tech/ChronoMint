FROM node:10.14-slim
ARG BUILD_BRANCH=develop
ARG NODE=production
ARG PUBLIC_BACKEND_REST_URL=https://backend.chronobank.io
RUN apt-get update -qq && \
    apt-get install -y build-essential python git libusb-1.0-0 libusb-1.0-0-dev && \
    echo "deb http://deb.debian.org/debian/ oldstable main contrib non-free" >> /etc/apt/sources.list \
    echo "deb-src http://deb.debian.org/debian/ oldstable main contrib non-free" >> /etc/apt/sources.list \
    apt-get update -qq && \
    apt-get install -y gcc-4.8 g++-4.8 && \
    mkdir -p /usr/src/app && \
    git clone -b ${BUILD_BRANCH} https://github.com/ChronoBank/ChronoMint.git /usr/src/app
WORKDIR /usr/src/app
RUN yarn
ENV PATH /root/.yarn/bin:$PATH
ENV NODE_ENV ${NODE}
RUN yarn build

FROM nginx:latest
WORKDIR /usr/src/app
COPY --from=0 /usr/src/app .
