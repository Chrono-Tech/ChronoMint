FROM node:7.9-slim
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
EXPOSE 3000
CMD ["npm start"]
