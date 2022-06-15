FROM node:14

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --development

COPY . .

EXPOSE 5555

CMD ["node", "src/index.js"]