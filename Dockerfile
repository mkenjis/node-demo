FROM node:6.2

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm install 

EXPOSE 8081
CMD ["node", "exprsrv.js"]
