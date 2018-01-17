FROM node:7.9-slim
RUN apt-get update -qq && \
    apt-get install -y build-essential python
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm rebuild node-sass --force && \
    echo "test"
EXPOSE 3000
CMD yarn start
