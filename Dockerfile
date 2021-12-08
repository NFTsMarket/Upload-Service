FROM node:16-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json .
RUN npm install --quiet

COPY . .

EXPOSE 8001

CMD [ "npm", "start" ]
