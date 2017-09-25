FROM node:7.9-slim
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN apt-get -qq update && apt-get -qq -y install git python make g++
RUN rm -rf /var/cache/apt/archives
RUN git clone https://github.com/s083r/ChronoMint.git .
RUN  npm install --quiet
EXPOSE 3000
CMD [ "npm", "start" ]
