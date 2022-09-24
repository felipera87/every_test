FROM node:18-alpine

WORKDIR /app

COPY . .

EXPOSE 3001

RUN yarn
CMD ["yarn", "start"]
