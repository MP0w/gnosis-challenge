FROM node:20-alpine

WORKDIR /app

COPY . .

RUN rm -rf node_modules

RUN npm install

EXPOSE 4000

CMD ["sh", "-c", "npm run migrate && npm run dev"]
